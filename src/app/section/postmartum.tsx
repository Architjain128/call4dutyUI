import React, { useState, useEffect } from "react";
import Loader from "@/components/loader";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


interface AlertEvent {
    id: string;
    type: string;
    description: string;
    user: string;
    time: string;
  }

async function getData(): Promise<[]> {
  // Fetch data from your API here.
  return [{
        incident : {
            id: `INC-1`,
            title: `Incident 1`,
            service: "Care",
            createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(), // Random past date
            priority: "Medium",
            status: "Resolved",
            team: "Voice Connect",
        },
        alertEvents : [
            {
                id:"1",
                type:"called",
                description:"called L1 user kwjebfehjrbfjherb erh erwhg hwerg erh gw rtwergh lhrwg hwgt kehr gtkwehrg tkhjwreg tkhjwrgt hjwergt ehjrtgwjhker tjwhkergt jehrgt kehjrwgt kregt werghtkejrhg tehqrgtkehqrwg",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"2",
                type:"acknowledged",
                description:"called L1 user kwjebfehjrbfjherb erh erwhg hwerg erh gw rtwergh lhrwg hwgt kehr gtkwehrg tkhjwreg tkhjwrgt hjwergt ehjrtgwjhker tjwhkergt jehrgt kehjrwgt kregt werghtkejrhg tehqrgtkehqrwg",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"3",
                type:"resolved",
                description:"called L1 user kwjebfehjrbfjherb erh erwhg hwerg erh gw rtwergh lhrwg hwgt kehr gtkwehrg tkhjwreg tkhjwrgt hjwergt ehjrtgwjhker tjwhkergt jehrgt kehjrwgt kregt werghtkejrhg tehqrgtkehqrwg",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"4",
                type:"called",
                description:"called L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"5",
                type:"acknowledged",
                description:"acknowledged by L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"6",
                type:"resolved",
                description:"resolved by L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"7",
                type:"called",
                description:"called L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"8",
                type:"acknowledged",
                description:"acknowledged by L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
            {
                id:"9",
                type:"resolved",
                description:"resolved by L1 user",
                user:"Archit Jain",
                time: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            },
        ]
    }]
}



const PostmartumPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/incidents"); // Example API call
        // const result = await response.json();
        // setData(result);
        const data = await getData()
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex-1 text-xl font-bold">
           Postmartum
           <br/>
           <br/>
        </div>
        {
            <Card>
            <CardHeader>
              <p>Incident Details</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="p-2 m-2">
                            <CardDescription>Title</CardDescription>
                            <CardTitle>{data[0].incident.title}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Priority</CardDescription>
                            <CardTitle>{data[0].incident.priority}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Service</CardDescription>
                            <CardTitle>{data[0].incident.service}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Status</CardDescription>
                            <CardTitle>{data[0].incident.status}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Team</CardDescription>
                            <CardTitle>{data[0].incident.team}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Created</CardDescription>
                            <CardTitle>{data[0].incident.createdAt}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Notes</CardDescription>
                            <Textarea  value={notes} onChange={(e)=>{setNotes(e.target.value)}} ></Textarea>
                            <Button className="mt-2">Save</Button>
                        </div>
                    </div>
                    <div className="h-100">
                        <p>Incident Events</p>
                        <ScrollArea className="h-[500px] rounded-md">
                        {
                            data[0].alertEvents.map((item:AlertEvent) => {
                                return <div className="p-2 m-2">
                                    <Card key={item.id}>
                                        <CardContent>
                                            <br/>
                                            <CardDescription className="p-1">Event Type : <strong>{item.type}</strong></CardDescription>
                                            <CardDescription className="p-1">User : <strong>{item.user}</strong></CardDescription>
                                            <CardDescription className="p-1">Created : <strong>{item.time}</strong></CardDescription>
                                            <CardDescription className="p-1">{item.description}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </div> 

                            })
                        }
                        </ScrollArea>
                    </div>
                </div>
            </CardHeader>
            <CardContent>

          
            </CardContent>

          </Card>
          
        }
    </div>
  );
};

export default PostmartumPage;
