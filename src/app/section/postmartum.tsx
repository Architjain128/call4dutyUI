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
import { useParams } from "react-router-dom";


const PostmartumPage: React.FC = () => {
  const id = useParams().id
  const [data, setData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users/all"); // Example API call
      const result = await response.json();
      setUserData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/incidents/"+id); // Example API call
      const result = await response.json();
      console.log(result)
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
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
                <div className="grid grid-cols-2 gap-4">
                    <div>
              <p>Incident Details</p>

                        <div className="p-2 m-2">
                            <CardDescription>Title</CardDescription>
                            <CardTitle>{data.title}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Priority</CardDescription>
                            <CardTitle>{data.priority}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Service</CardDescription>
                            <CardTitle>esc_t1</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Status</CardDescription>
                            <CardTitle>{data.status}</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Team</CardDescription>
                            <CardTitle>esc_t</CardTitle>
                        </div>
                        <div className="p-2 m-2">
                            <CardDescription>Created</CardDescription>
                            <CardTitle>{new Date(data.createdTime).toTimeString()}</CardTitle>
                        </div>
                        {/* <div className="p-2 m-2">
                            <CardDescription>Notes</CardDescription>
                            <Textarea  value={notes} onChange={(e)=>{setNotes(e.target.value)}} ></Textarea>
                            <Button className="mt-2">Save</Button>
                        </div> */}
                    </div>
                    <div className="h-100">
                        <p>Incident Events</p>
                        <ScrollArea className="h-[500px] rounded-md">
                        {
                            data.assignmentHistory.map((item) => {
                                return <div className="p-2 m-2">
                                    <Card key={item.id}>
                                        <CardContent>
                                            <br/>
                                            <CardDescription className="p-1">Event Status : <strong>{item.status}</strong></CardDescription>
                                            <CardDescription className="p-1">User Id: <strong>{item.userId}</strong></CardDescription>
                                            <CardDescription className="p-1">Created : <strong>{item.timestamp}</strong></CardDescription>
                                            <CardDescription className="p-1">Escalation Policy Id <strong>{item.escalationPolicyId}</strong> </CardDescription>
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
