import { Incidents, readOnlyColumns } from "./columns"
import Loader from "@/components/loader";
import {Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip  } from "recharts"
import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import {
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"


  import {
    Tooltip as TooltipHover,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

  
  const randomDateWithinNext7Days = () => {
    const now = Date.now();
    const sevenDaysLater = now + 7 * 24 * 60 * 60 * 1000; // Add 7 days in milliseconds
    const randomDate = new Date(now + Math.random() * (sevenDaysLater - now));
    return randomDate.toISOString();
  };
  


export const generateDummyIncidents = (count: number): Incidents[] => {
    const statuses = ["Acknowleded", "Resolved", "Escalated", "Unknown"] as const;
    const priorities = ["Low", "Medium", "High", "Critical"];
    const services = ["Authentication", "Database", "API Gateway", "Frontend", "Backend"];
    const teams = ["Team1", "Team2", "Team3", "Team4"];
  
    return Array.from({ length: count }, (_, index) => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomTeams = teams[Math.floor(Math.random() * teams.length)];
  
      return {
        id: `INC-${index + 1}`,
        title: `Incident ${index + 1}`,
        service: randomService,
        createdAt: randomDateWithinNext7Days(),
        priority: randomPriority,
        status: randomStatus,
        team: randomTeams,
      };
    });
  };
  
async function getData(): Promise<Incidents[]> {
  // Fetch data from your API here.
  return generateDummyIncidents(100)
}


import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, InfoIcon, Sparkle } from "lucide-react";
 
const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  const chartConfig2 = {
    high: {
      label: "HIGH",
      color: "#2563eb",
    },
    critical: {
      label: "CRITICAL",
      color: "#60a5fa",
    },
  } satisfies ChartConfig
 

const ON_CALL_WEIGHT = 20;
const ON_CALL_WEIGHT_LOW = 2;
const ON_CALL_WEIGHT_MEDIUM = 5;
const ON_CALL_WEIGHT_HIGH = 7;
const ON_CALL_WEIGHT_CRITICAL = 10;

const AiInsightsPage: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [useableData, setUseableData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamsTotal, setTeamsTotal] = useState<any>([]);
  const [servicesTotal, setServicesTotal] = useState<any>([]);
  const [prioriyTotal, setPriorityTotal] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState(" ");
  const [selectedService, setSelectedService] = useState(" ");
  const [selectedPriority, setSelectedPriority] = useState(" ");
  const [tomorrowDate, setTomorrowDate] = useState("")

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    setTomorrowDate(yesterday.toLocaleDateString());

    const fetchData = async () => {
      try {
        // const response = await fetch("/api/incidents"); // Example API call
        // const result = await response.json();
        // setData(result);
        const data = await getData()
        // data.sort((a,b)=>{a.createdAt-b.createdAt})
        let teams = Array.from(new Set(data.map((item) => item.team)))
        let services = Array.from(new Set(data.map((item) => item.service)))
        let priority = Array.from(new Set(data.map((item) => item.priority)))
        setData(data);
        setTeamsTotal(teams);
        setServicesTotal(services);
        setPriorityTotal(priority);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(()=>{
    if(!data) return;
    let newData=data;
    if(selectedTeam!=" "){
        newData=newData.filter((x)=>x.team===selectedTeam)
    }
    if(selectedService!=" "){
        newData=newData.filter((x)=>x.service===selectedService)
    }
    if(selectedPriority!=" "){
        newData=newData.filter((x)=>x.priority===selectedPriority)
    }
    setUseableData(newData);
    let newGraphData = preprocessData(newData);
    setGraphData(newGraphData);
  },[data, selectedTeam, selectedService, selectedPriority])




  function preprocessData(rawData:[Incidents]) {
    const groupedData: Record<string, { count: number }> = {};

    rawData.forEach((item: Incidents) => {
        const createdAt = new Date(item.createdAt);
        let date = createdAt.getDate().toString() + "/" + (createdAt.getMonth() + 1).toString() + "/" + createdAt.getFullYear().toString(); // Correct month index
        
        if (!groupedData[date]) {
          groupedData[date] = { count: 0, highPriority: 0, criticalPriority: 0, onCallPoints: 0 }; // Initialize counters
        }
      
        // Increment total count
        groupedData[date].count += 1;
      
        // Check priority and increment respective counters
        if (item.priority === "High") {
          groupedData[date].highPriority += 1;
          groupedData[date].onCallPoints += ON_CALL_WEIGHT_HIGH;
        } else if (item.priority === "Critical") {
          groupedData[date].criticalPriority += 1;
          groupedData[date].onCallPoints += ON_CALL_WEIGHT_CRITICAL;
        } else if (item.priority === "Medium") {
            groupedData[date].criticalPriority += 1;
            groupedData[date].onCallPoints +=ON_CALL_WEIGHT_MEDIUM ;
        } else {
            groupedData[date].criticalPriority += 1;
            groupedData[date].onCallPoints +=ON_CALL_WEIGHT_LOW ;
        }
      });

    return Object.entries(groupedData).map(([time, {count,highPriority,criticalPriority,onCallPoints}]) => ({time,incidents: count, high: highPriority, critical: criticalPriority, onCallNeeded: Math.ceil(onCallPoints/ON_CALL_WEIGHT)})).sort((a, b) => {
        const dateA = new Date(a.time.split('/').reverse().join('-')); // Convert "dd/mm/yyyy" to "yyyy-mm-dd"
        const dateB = new Date(b.time.split('/').reverse().join('-'));
        return dateA - dateB; // Sort in ascending order
      });
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex text-xl font-bold gap-1">
            Incident Insights by <strong>AI</strong> <Sparkle/>
           <br/>
           <br/>
        </div>
        <div>
            <Card className="pt-4 bg-cyan-50 ">
                <CardContent>
                    <CardTitle  className="mb-2 text-cyan-800">AI Prediction for next 7 coming day</CardTitle>
                    <CardDescription className="mb-1 text-cyan-600">
                    On this page, you'll find AI-driven predictions for the next 7 days, forecasting potential incidents across teams, services, and priority levels. These insights help your organization proactively plan on-call schedules, optimize resource allocation, and reduce downtime.
                    </CardDescription>
                    <CardDescription className="flex justify-end item-center text-cyan-800 gap-2">
                        <Clock size='20'/> Latest AI Insights generated on {tomorrowDate}
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
        <div className="flex gap-4 p-2">
            <div>
                <Label>Teams</Label>
                <Select onValueChange={(value)=>setSelectedTeam(value)} defaultValue={selectedTeam}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose Team" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All</SelectItem>
                        {
                            teamsTotal.map((x)=><SelectItem value={x}>{x}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Services</Label>
                <Select onValueChange={(value)=>setSelectedService(value)} defaultValue={selectedService}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose Service" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All</SelectItem>
                        {
                            servicesTotal.map((x)=><SelectItem value={x}>{x}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Priority</Label>
                <Select onValueChange={(value)=>setSelectedPriority(value)} defaultValue={selectedPriority}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All</SelectItem>
                        {
                            prioriyTotal.map((x)=><SelectItem value={x}>{x}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>
        </div>


        <Card className="p-2 m-2 mb-4">
            <CardHeader>
                <CardDescription>Predicted Incident Volume</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart accessibilityLayer data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis 
                            dataKey="incidents"
                            tickLine={false}
                            tickMargin={10} 
                        />
                        <Tooltip />
                        <Line type="monotone" dataKey="incidents" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>


        <Card className="p-2 m-2 mb-4">
            <CardHeader>
                <CardDescription>High Risk Incident Volume</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig2} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={graphData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                dataKey="high"
                stackId="a"
                fill="orange"
                radius={[0, 0, 4, 4]}
                />
                <Bar
                dataKey="critical"
                stackId="a"
                fill="red"
                radius={[4, 4, 0, 0]}
                />
            </BarChart>
            </ChartContainer>
            </CardContent>
        </Card>


        <Card className="p-2 m-2 mb-4">
            <CardHeader>
                <CardDescription className="flex gap-4 item-center">
                    On Call People Needed 
                    <TooltipProvider>
                        <TooltipHover>
                            <TooltipTrigger asChild>
                                <InfoIcon size={15}/>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p style={{maxWidth:"300px"}}>
                                    These weights help determine the number of on-call personnel required to handle incidents based on their severity. By summing the weights of active incidents and comparing them to the on-call capacity, we ensure proper resource allocation for effective incident management.
                                </p>
                            </TooltipContent>
                        </TooltipHover>
                    </TooltipProvider>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart accessibilityLayer data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis 
                            dataKey="onCallNeeded"
                            tickLine={false}
                            tickMargin={10} 
                        />
                        <Tooltip />
                        <Line type="monotone" dataKey="onCallNeeded" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>

       

      

    </div>
  );
};

export default AiInsightsPage;
