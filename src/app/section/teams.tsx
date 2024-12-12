import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import React, { useState, useEffect } from "react";
import { teams, users, escalationPolicies } from "../../data/dummydata";
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
import { MultipleSelector } from "@/components/ui/multi-selector";

const TeamsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamUsers, setNewTeamUsers] = useState<string[]>([])
  const [newTeamEscalationPolicy, setNewTeamEscalationPolicy] = useState<string[]>([])
  const [userOptions, setUserOption] = useState<any[]>([])
  const [escaltionPolicyOptions, setEscaltionPolicyOption] = useState<any>([])
  const [teamData, setTeamData] = useState([])
  const [userData, setUserData] = useState([])
  const [epData, setEpData] = useState([])
  const[up,setUp]= useState("")


  const fetchUserData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users/all"); // Example API call
      const result = await response.json();
      setUserData(result);
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

  const fetchTeamData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/all"); // Example API call
      const result = await response.json();
      setTeamData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  function getFirst(x){
    console.log(">>", x)
    if(!x)return "NaN"
    return x[0].label
  }

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
    fetchUserData()
    fetchTeamData()
    fetchEpData()
  }, []);

  useEffect(() => {
    fetchUserData()
    fetchTeamData()
    fetchEpData()
  }, [up]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex text-xl font-bold justify-between">
           All Teams
           <br/>
           <br/>
        </div>

        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3">
            <div className="flex justify-end" >
            <Dialog>
                    <DialogTrigger>
                        <Button onClick={()=>{
                            setNewTeamName("")
                            setNewTeamUsers([])
                            setNewTeamEscalationPolicy([])
                        }}>
                            <PlusIcon/> Create New Team
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                            Complete the form with team details. Click save when you're done.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Name
                            </Label>
                            <Input id="name" className="col-span-3" value={newTeamName} onChange={(e)=>setNewTeamName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Escaltion Policy
                            </Label>
                            <div className="col-span-3">
                                <MultipleSelector options={escaltionPolicyOptions} value={newTeamEscalationPolicy} setValue={setNewTeamEscalationPolicy}/>
                            </div>
                        </div>
                        </div>
                        <DialogFooter>
                        <DialogClose asChild>
                        <Button type="submit" onClick={async()=>{
                            let newTeamData = {
                                name: newTeamName,
                                // users: newTeamUsers,
                                escalationPolicyIds: newTeamEscalationPolicy
                            }
                            console.log("new team", newTeamData)


                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams", {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newTeamData), // Convert data to JSON string
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
    
                        }}>Create</Button>
                        </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
      
          </div>
         
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Escaltion Policy</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            teamData.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell>{x.escalationPolicyIds.map((y)=>{return <Badge className="m-1">{escaltionPolicyOptions.filter((z)=>{return z.value==y})[0].label}</Badge>})}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="m-1"
                                                    onClick={()=>{
                                                        setNewTeamName(x.name)
                                                        setNewTeamEscalationPolicy(x.escalationPolicyIds)
                                                    }}
                                                > Edit </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[525px]">
                                                    <DialogHeader>
                                                    <DialogTitle>Edit Team</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your team here. Click save when you're done.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Name
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newTeamName} onChange={(e)=>setNewTeamName(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="username" className="text-right">
                                                        Escaltion Policy
                                                        </Label>
                                                        <div className="col-span-3">
                                                            <MultipleSelector options={escaltionPolicyOptions} value={newTeamEscalationPolicy} setValue={setNewTeamEscalationPolicy}/>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                    <Button type="submit" onClick={async()=>{
                                                        let newTeamData = {
                                                            // id: x.id,
                                                            name: newTeamName,
                                                            // users: newTeamUsers,
                                                            escalationPolicyIds: newTeamEscalationPolicy
                                                        }
                                                        console.log("edit team", newTeamData)
                                                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/"+x.id, {
                                                            method: 'PATCH',
                                                            headers: {
                                                              'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(newTeamData)
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
                                                        This action cannot be undone. This will permanently delete your team.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={async()=>{
                                                            console.log(x.id)
                                                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/"+x.id, {
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

export default TeamsPage;
