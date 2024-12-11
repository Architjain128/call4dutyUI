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

    let newUserOptions = []
    users.forEach((x)=>{
        newUserOptions.push({label:x.name, value:x.id})
    })
    setUserOption(newUserOptions)

    let newEscalationPolicyOptions = []
    escalationPolicies.forEach((x)=>{
        newEscalationPolicyOptions.push({label:x.name, value:x.id})
    })
    setEscaltionPolicyOption(newEscalationPolicyOptions)

  }, []);

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
                            Users
                            </Label>
                            <div className="col-span-3">
                                <MultipleSelector options={userOptions} value={newTeamUsers} setValue={setNewTeamUsers}/>
                            </div>
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
                                escaltionPolicy: newTeamEscalationPolicy
                            }
                            console.log("new team", newTeamData)


                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams", {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: newTeamData, // Convert data to JSON string
                              })
                                .then(response => {
                                  if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                  }
                                  return response.json(); // Parse the JSON response
                                })
                                .then(data => {
                                  console.log("Response data:", data);
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
                        <TableHead>Users</TableHead>
                        <TableHead>Escaltion Policy</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            teams.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell>{x.users.map((y)=>{return <Badge className="m-1">{y}</Badge>})}</TableCell>
                                        <TableCell>{x.escaltionPolicy.map((y)=>{return <Badge className="m-1">{y}</Badge>})}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="m-1"
                                                    onClick={()=>{
                                                        setNewTeamName(x.name)
                                                        setNewTeamUsers(x.users)
                                                        setNewTeamEscalationPolicy(x.escaltionPolicy)
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
                                                        Users
                                                        </Label>
                                                        <div className="col-span-3">
                                                            <MultipleSelector options={userOptions} value={newTeamUsers} setValue={setNewTeamUsers}/>
                                                        </div>
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
                                                    <Button type="submit" onClick={()=>{
                                                        let newTeamData = {
                                                            id: x.id,
                                                            name: newTeamName,
                                                            users: newTeamUsers,
                                                            escaltionPolicy: newTeamEscalationPolicy
                                                        }
                                                        console.log("edit team", newTeamData)
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
                                                        <Button type="submit" onClick={()=>{console.log(x.id)}}>Confirm</Button>
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
