import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Table, TableHead, TableHeader, TableRow, TableCaption, TableCell, TableBody } from "@/components/ui/table";


  import { escalationPolicies, escalationLevels, schedules} from "../../data/dummydata";
  import { Button } from "@/components/ui/button";
  import { Leaf, PlusIcon } from "lucide-react";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

type EscalationFormPageProps = {
    newEntry: boolean | null;
  };
  

const newEscalationLevel = {
    level: "",
    scheduleId: "",
    userId: "",
    gapOnRetry: 1
}

const newEscalationPolicy = {
    name: "",
    description: "",
    retryTime: 1,
    levels: [{
        level: "",
        scheduleId: "",
        userId: "",
        gapOnRetry: 1
    }]
}

export default function EscalationFormPage({newEntry} : EscalationFormPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newEP, setNewEP] = useState(preprocess());
  const [sch, setSch] = useState([]);


  function preprocess() {
    if(newEntry) return newEscalationPolicy;
    const id = useParams().id
    let ep= escalationPolicies.filter((x)=>x.id===id)[0]
    let epl = escalationLevels.filter((x)=>x.escalationPolicyId===id).sort((a, b) => a.level - b.level);
    let newEP = newEscalationPolicy;
    newEP.name = ep.name
    newEP.description = ep.description
    newEP.retryTime = Number(ep.retryTime)
    newEP.levels = epl
    return newEP;

  }


  const fetchSchData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/schedules/all"); // Example API call
      const result = await response.json();
      console.log(result)
      setSch(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchData();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  function updateNewEP(value, field) {
    setNewEP({ ...newEP, [field]: value });
  }

  return (
    <div>
        <div className="flex text-xl font-bold justify-between">
            {
                newEntry ? "New Escalation Policy" : "Edit Escalation Policy"
            }
            <div></div>
           <Button onClick={async()=>{

                let ep = {
                    name: newEP.name,
                    description: newEP.description
                }



                const createResponse = await fetch(
                    "https://qa6-call-for-duty-global.sprinklr.com/api/pager/escalation-policies", 
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(ep)
                    }
                  );
              
                  // Check if the response is not ok
                  if (!createResponse.ok) {
                    throw new Error(`HTTP error! Status: ${createResponse.status}`);
                  }
              
                  // Parse the response to get the policy ID
                  const createdPolicy = await createResponse.json();
                  const policyId = createdPolicy.id;
              
                  newEP.levels.map(async(yy,idx)=>{
                    let el={
                        escalationPolicyId: policyId,
                        level: idx+1,
                        scheduleId: yy.scheduleId
                    }

                    const detailsResponse = await fetch(
                        `https://qa6-call-for-duty-global.sprinklr.com/api/pager/escalation-levels`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(el)
                        }
                    );
                    if (!detailsResponse.ok) {
                        throw new Error(`HTTP error fetching details! Status: ${detailsResponse.status}`);
                      }
                  
                      // Parse and return the details
                      const policyDetails = await detailsResponse.json();
                  })
              
                  window.location.pathname = "/escaltionPolicy"
            }}>
                Save Changes
            </Button>
           <div></div>
        </div>
        <div className="grid grid-cols-4 gap-8 p-2">
            <div className="flex-inline col-span-3">
                <div>
                    <Label>Name</Label>
                    <Input id="name" className="col-span-3" value={newEP.name} onChange={(e)=>updateNewEP(e.target.value, "name")} />
                </div>
                <div>
                    <Label>Description</Label>
                    <Input id="name" className="col-span-3" value={newEP.description} onChange={(e)=>updateNewEP(e.target.value, "description")} />
                </div>
                <br/>
                <div className="flex justify-end">
                        <Button variant="outline" onClick={()=>{
                            setNewEP({ ...newEP, levels: [...newEP.levels, newEscalationLevel] });
                        }}>
                            <PlusIcon/> Add New Level
                        </Button>
                </div>
                <br/>

                <div>
                    {
                        newEP.levels.map((x,idx)=>(
                            <Card className="mb-2">
                                <CardHeader>
                                    <CardTitle>Level {idx+1}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <div>
                                    <Label>Schedule</Label>
                                    <div className="col-span-3">
                                    <Select onValueChange={(value)=>{
                                            setNewEP((prev) => ({
                                            ...prev,
                                            levels: prev.levels.map((level, i) =>
                                                i === idx ? { ...level, scheduleId: value } : level
                                            ),
                                            }));
                                        }} defaultValue={newEP.levels[idx].scheduleId}>
                                        <SelectTrigger >
                                            <SelectValue placeholder="Choose Schedule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=" ">None</SelectItem>
                                            {
                                                sch.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    </div>
                                </div>
                                </CardContent>
                    
                            </Card>
                    
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  );
};


