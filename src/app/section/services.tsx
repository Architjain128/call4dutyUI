import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import React, { useState, useEffect } from "react";
import { teams, escalationPolicies, services } from "../../data/dummydata";
import { Table, TableHead, TableHeader, TableRow, TableCaption, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { sleep } from "./entites";

const ServicesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDes, setNewServiceDes] = useState("");
  const [newServiceTeamId, setNewServiceTeamId] = useState(" ");
  const [newServiceEPId, setNewServiceEPId] = useState(" ");
  const [userOptions, setUserOption] = useState<any[]>([])
  const [escaltionPolicyOptions, setEscaltionPolicyOption] = useState<any>([])
  const [teamData, setTeamData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [epData, setEpData] = useState([])
  const[up,setUp]= useState("")



  const fetchServicesData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services/all"); // Example API call
      const result = await response.json();
      setServiceData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/all"); // Example API call
      const result = await response.json();
      setTeamData(result);
      let newUserOptions = []
      result.forEach((x)=>{
          newUserOptions.push({label:x.name, value:x.id})
      })
      setUserOption(newUserOptions)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchEpData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/escalation-policies/all"); // Example API call
      const result = await response.json();
      setEpData(result);
      let newEscalationPolicyOptions = []
      result.forEach((x)=>{
          newEscalationPolicyOptions.push({label:x.name, value:x.id})
      })
      console.log(newEscalationPolicyOptions)
      setEscaltionPolicyOption(newEscalationPolicyOptions)
    
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchServicesData()
    fetchTeamData()
    fetchEpData()
  }, []);

  useEffect(() => {
    fetchServicesData()
    fetchTeamData()
    fetchEpData()
  }, [up]);


  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex text-xl font-bold justify-between">
           All Services
           <br/>
           <br/>
        </div>

        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3">
            <div className="flex justify-end" >
            <Dialog>
                <DialogTrigger asChild>
                <Button onClick={()=>{
                    setNewServiceName("")
                    setNewServiceDes("")
                    setNewServiceTeamId(" ")
                    setNewServiceEPId(" ")
                }}>
                    <PlusIcon/> Create New Service
                </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Complete the form with service details. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input id="name" className="col-span-3" value={newServiceName} onChange={(e)=>setNewServiceName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Description
                        </Label>
                        <Input id="name" className="col-span-3" value={newServiceDes} onChange={(e)=>setNewServiceDes(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Team
                        </Label>
                        <div className="col-span-3">
                        <Select onValueChange={(value)=>setNewServiceTeamId(value)} defaultValue={newServiceTeamId}>
                            <SelectTrigger >
                                <SelectValue placeholder="Choose Team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None</SelectItem>
                                {
                                    teamData.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Escalation Policy
                        </Label>
                        <div className="col-span-3">

                        <Select onValueChange={(value)=>setNewServiceEPId(value)} defaultValue={newServiceEPId}>
                            <SelectTrigger >
                                <SelectValue placeholder="Choose Escalation Policy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None</SelectItem>
                                {
                                    epData.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                        </div>
                    </div>

                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                    <Button type="submit" onClick={async()=>{
                        let newUserData = {
                            name: newServiceName,
                            description: newServiceDes,
                            teamId: newServiceTeamId,
                            escalationPolicyId: newServiceEPId,
                        }
                        console.log("new service", newUserData)

                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services", {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newUserData), // Convert data to JSON string
                          })
                            .then(response => {
                              if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                              }
                              return response.json(); // Parse the JSON response
                            })
                            .then(data => {
                              console.log("Response data:", data);
                              setUp(new Date().toLocaleTimeString())

                            })
                            .catch(error => {
                              console.error('Error:', error);
                            });

                    }}>Save changes</Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
         
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Escaltion Policy</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            serviceData.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell className="font-medium">{x.description}</TableCell>
                                        <TableCell className="font-medium">{teamData.filter((y)=>{return y.id===x.teamId})[0].name}</TableCell>
                                        <TableCell className="font-medium">{epData.filter((y)=>{return y.id===x.escalationPolicyId})[0].name}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="m-1" 
                                                    onClick={()=>{
                                                        setNewServiceName(x.name)
                                                        setNewServiceDes(x.description)
                                                        setNewServiceTeamId(x.teamId)
                                                        setNewServiceEPId(x.escalationPolicyId)
                                                    }}
                                                > 
                                                Edit 
                                                </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[525px]">
                                                    <DialogHeader>
                                                    <DialogTitle>Edit User</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your service here. Click save when you're done.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Name
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newServiceName} onChange={(e)=>setNewServiceName(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Description
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newServiceDes} onChange={(e)=>setNewServiceDes(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Team
                                                        </Label>
                                                        <div className="col-span-3">
                                                        <Select onValueChange={(value)=>setNewServiceTeamId(value)} defaultValue={newServiceTeamId}>
                                                            <SelectTrigger >
                                                                <SelectValue placeholder="Choose Team" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value=" ">None</SelectItem>
                                                                {
                                                                    teamData.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        </div>

                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Escaltion Policy
                                                        </Label>
                                                        <div className="col-span-3">

                                                        <Select onValueChange={(value)=>setNewServiceEPId(value)} defaultValue={newServiceEPId}>
                                                            <SelectTrigger >
                                                                <SelectValue placeholder="Choose Escalation Policy" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value=" ">None</SelectItem>
                                                                {
                                                                    epData.map((x)=><SelectItem value={x.id}>{x.name}</SelectItem>)
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        </div>
                                                    </div>
                                           
                                                    </div>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                    <Button type="submit" onClick={async()=>{
                                                        let newUserData = {
                                                            // id: x.id,
                                                            name: newServiceName,
                                                            description: newServiceDes,
                                                            teamId: newServiceTeamId,
                                                            escalationPolicyId: newServiceEPId,
                                                        }
                                                        console.log("edit service", newUserData)
                                                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services/"+x.id, {
                                                            method: 'PATCH',
                                                            headers: {
                                                              'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(newUserData), // Convert data to JSON string
                                                          })
                                                            .then(response => {
                                                              if (!response.ok) {
                                                                throw new Error(`HTTP error! Status: ${response.status}`);
                                                              }
                                                              return response.json(); // Parse the JSON response
                                                            })
                                                            .then(data => {
                                                              console.log("Response data:", data);
                                                              setUp(new Date().toLocaleTimeString())
                                
                                                            })
                                                            .catch(error => {
                                                              console.error('Error:', error);
                                                            });
                                                    }}>Save changes</Button>
                                                    </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                         
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button variant="destructive" size="sm" className="m-1">
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                    <DialogTitle> Deleting <strong>{x.name}</strong>, are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete your service.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={async()=>{
                                                            console.log(x.id)
                                                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services/"+x.id, {
                                                                method: 'DELETE',
                                                                headers: {
                                                                  'Content-Type': 'application/json',
                                                                },
                                                              })
                                                                .then(response => {
                                                                  if (!response.ok) {
                                                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                                                  }
                                                                })
                                                                .then(data => {
                                                                  console.log("Response data:", data);
                                                                  setUp(new Date().toLocaleTimeString())
                                                                })
                                                                .catch(error => {
                                                                  console.error('Error:', error);
                                                                });
                                                        }}>Confirm</Button>
                                                    </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>


       


        </div>
    </div>
  );
};

export default ServicesPage;
