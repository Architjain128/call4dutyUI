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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/incidents"); // Example API call
        // const result = await response.json();
        // setData(result);
        // const data = await getData()
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
           <Button onClick={()=>{}}>Save Changes</Button>
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
                <div>
                    <Label>Retry Routine Count</Label>
                    <Input id="name" className="col-span-3" value={newEP.retryTime} onChange={(e)=>updateNewEP(e.target.value, "retryTime")} />
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
                                                schedules.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Retry Same User in minutes</Label>
                                    <Input
                                        id="name"
                                        className="col-span-3"
                                        value={newEP.levels[idx].gapOnRetry}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setNewEP((prev) => ({
                                            ...prev,
                                            levels: prev.levels.map((level, i) =>
                                                i === idx ? { ...level, gapOnRetry: value } : level
                                            ),
                                            }));
                                        }}
                                    />
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


