import { Incidents, readOnlyColumns } from "./columns"
import Loader from "@/components/loader";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip  } from "recharts"
import React, { useState, useEffect, useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  
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
        createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(), // Random past date
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
import { DataTable } from "./data-table";
import { Label } from "@/components/ui/label";
 
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
 



const InsightsPage: React.FC = () => {
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
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [escalationPolicyOptions, setEscalationPolicyOptions] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [epData, setEpData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [up, setUp] = useState("");

  // Memoize fetch functions to prevent recreation on every render
  const fetchEpData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/escalation-policies/all");
      const result = await response.json();
      setEpData(result);
      return result;
    } catch (error) {
      console.error("Error fetching escalation policies:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchTeamData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/all");
      const result = await response.json();
      setTeamData(result);
      return result;
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchServicesData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services/all");
      const result = await response.json();
      setServiceData(result);
      return result;
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/incidents/all");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching incidents:", error);
      return [];
    }
  }, []); // Empty dependency array

  // Memoize preprocessing to prevent unnecessary recalculations
  const preprocessData2 = useCallback((fetchedData, services, teamData) => {
    if (!fetchedData || !services || !teamData) return [];

    let tmpData = fetchedData.map((x) => {
      const service = services.find((z) => 
        x.currentAssignment?.impactedServiceId === z.id
      );
      console.log(service)
      const team = teamData.find((z) => 
        z.id === service?.teamId
      );

      return {
        id: x.id,
        title: x.title,
        service: service?.name || 'Unknown',
        createdAt: x.createdTime,
        priority: x.priority, // Add priority logic if needed
        status: x.status,
        team: team?.name || 'Unknown', // Add team logic if needed
      };
    });
    let teams = Array.from(new Set(data.map((item) => item.team)))
    let services3 = Array.from(new Set(data.map((item) => item.service)))
    let priority = Array.from(new Set(data.map((item) => item.priority)))
    setData(data);
    setTeamsTotal(teams);
    setServicesTotal(services3);
    setPriorityTotal(priority);
    console.log(tmpData)
    return tmpData
  }, []); // Empty dependency array

  // Use a single useEffect with a flag to prevent multiple fetches
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [incidentData, , servicesData, teamData] = await Promise.all([
          fetchData(),
          fetchEpData(),
          fetchServicesData(),
          fetchTeamData()
        ]);

        // Only update state if component is still mounted
        if (isMounted) {
          const processedData = preprocessData2(incidentData, servicesData, teamData);
          setData(processedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const response = await fetch("/api/incidents"); // Example API call
//         // const result = await response.json();
//         // setData(result);
//         const data = await getData()
//         let teams = Array.from(new Set(data.map((item) => item.team)))
//         let services = Array.from(new Set(data.map((item) => item.service)))
//         let priority = Array.from(new Set(data.map((item) => item.priority)))
//         setData(data);
//         setTeamsTotal(teams);
//         setServicesTotal(services);
//         setPriorityTotal(priority);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);


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

    rawData.forEach((item:Incidents) => {
        const createdAt = new Date(item.createdAt);
        let date = createdAt.getDate().toString() +"/"+ createdAt.getMonth().toString() +"/"+ createdAt.getFullYear().toString();
        console.log(date)
        if (!groupedData[date]) {
          groupedData[date] = { count: 0 };
        }
      
        groupedData[date].count += 1;
      });

    return Object.entries(groupedData).map(([time, {count}]) => ({time,incidents: count,})).sort((a, b) => {
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
        <div className="flex-1 text-xl font-bold">
           Incident Based Insights
           <br/>
           <br/>
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

        <div className="grid grid-cols-4 gap-4 p-2">
            <Card>
                <CardHeader>
                    <CardTitle>Total Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl">{useableData.length}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Incidents Escalated</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl">{useableData.filter((x)=>x.status==="Escalated").length}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Incidents Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl">{useableData.filter((x)=>x.status==="Resolved").length}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Incidents Acknowleded</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl">{useableData.filter((x)=>x.status==="Acknowleded").length}</p>
                </CardContent>
            </Card>
        </div>

        <Card className="p-2 m-2 mb-4">
            <CardHeader>
                <CardDescription>Incident Volume</CardDescription>
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

        <div className="p-2">
            <DataTable columns={readOnlyColumns} data={useableData} readonly={true}></DataTable>
        </div>

      

    </div>
  );
};

export default InsightsPage;
