import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import React, { useState, useEffect } from "react";
import { teams, users, escalationPolicies, schedules } from "../../data/dummydata";
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
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultipleSelector } from "@/components/ui/multi-selector";
import { Checkbox } from "@radix-ui/react-checkbox";

const SchedulePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userOptions, setUserOption] = useState<any[]>([])
  const [newScheduleName, setNewScheduleName] = useState<string>("");
  const [newScheduleDescription, setNewScheduleDescription] = useState<string>("");
  const [newOnCallUserId, setNewOnCallUserId] = useState<string>("");
  const [newOnCallRotationDays, setNewOnCallRotationDays] = useState<string>("7");
  const [newIsRoundRobin, setNewIsRoundRobin] = useState<boolean>(false);
  const [newScheduleUsers, setNewScheduleUsers] = useState<string[]>([]);
  const [userData, setUserData] = useState([])
  const[up,setUp]= useState("")

  const fetchData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/schedules/all"); // Example API call
      const result = await response.json();
      console.log(result)
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);


  useEffect(() => {
    fetchData();
    fetchUserData();

  }, [up]);


  useEffect(()=>{
    setNewOnCallUserId(" ")
  },[newScheduleUsers])

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex text-xl font-bold justify-between">
           All Schedules
           <br/>
           <br/>
        </div>

        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-4">
            <div className="flex justify-end" >
            <Dialog>
                    <DialogTrigger>
                        <Button onClick={()=>{
                            setNewScheduleName("")
                            setNewScheduleDescription("")
                            setNewOnCallUserId("")
                            setNewOnCallRotationDays(7)
                            setNewIsRoundRobin(false)
                            setNewScheduleUsers([])
                        }}>
                            <PlusIcon/> Create New Schedule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                        <DialogTitle>Create New Schedule</DialogTitle>
                        <DialogDescription>
                            Complete the form with schedule details. Click save when you're done.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Name
                            </Label>
                            <Input id="name" className="col-span-3" value={newScheduleName} onChange={(e)=>setNewScheduleName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Description
                            </Label>
                            <Input id="name" className="col-span-3" value={newScheduleDescription} onChange={(e)=>setNewScheduleDescription(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            On Call Rotation Period (Days)
                            </Label>
                            <Input id="name" className="col-span-3" value={newOnCallRotationDays} onChange={(e)=>setNewOnCallRotationDays(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            On Call Rotation Round Robin
                            </Label>
                            <div className="col-span-3">
                            <Select onValueChange={(value)=>setNewIsRoundRobin(value==="True"?true:false)} defaultValue={newIsRoundRobin?"True":"False"}>
                                <SelectTrigger >
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="False">False</SelectItem>
                                    <SelectItem value="True">True</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Users
                            </Label>
                            <div className="col-span-3">
                                <MultipleSelector options={userOptions} value={newScheduleUsers} setValue={setNewScheduleUsers}/>
                            </div>
                        </div>
                        { newScheduleUsers && newScheduleUsers.length > 0?
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            On Call
                            </Label>
                            <div className="col-span-3">
                            <Select onValueChange={(value)=>setNewOnCallUserId(value)} defaultValue={newOnCallUserId}>
                                <SelectTrigger >
                                    <SelectValue placeholder="Select from users" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        userData.map((x)=>{
                                            if(newScheduleUsers.filter((y)=>y===x.id).length > 0)
                                            return <SelectItem value={x.id}>{x.name}</SelectItem>
                                        })

                                    }
                                
                                </SelectContent>
                            </Select>
                            </div>
                        </div>:null}
                        </div>
                        <DialogFooter>
                        <DialogClose asChild>
                        <Button type="submit" onClick={async()=>{
                            let newTeamData = {
                                name: newScheduleName,
                                description: newScheduleDescription,
                                onCallUserId: newOnCallUserId,
                                onCallRotationDays: parseInt(newOnCallRotationDays),
                                roundRobin: newIsRoundRobin,
                                userIds: newScheduleUsers
                            }
                            console.log("new schedule", newTeamData)

                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/schedules", {
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
                        <TableHead>Description</TableHead>
                        <TableHead>On Call</TableHead>
                        <TableHead>On Call Rotaion</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell className="font-medium">{x.description}</TableCell>
                                        <TableCell className="font-medium">{userData.filter((y)=>{return y.id===x.onCallUserId}).length > 0 ? userData.filter((y)=>{return y.id===x.onCallUserId})[0].name : "UNKNOWN"  }</TableCell>
                                        <TableCell className="font-medium">{x.onCallRotationDays} days {x.roundRobin?" | Round Robin":""}</TableCell>
                                        <TableCell>{x.userIds.map((y)=>{return <Badge className="m-1">{userData.filter((z)=>{return z.id===y}).length > 0 ? userData.filter((z)=>{return z.id===y})[0].name : "UNKNOWN"}</Badge>})}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="m-1"
                                                    onClick={()=>{
                                                        setNewScheduleName(x.name)
                                                        setNewScheduleDescription(x.description)
                                                        setNewOnCallUserId(x.onCallUserId)
                                                        setNewOnCallRotationDays(x.onCallRotationDays)
                                                        setNewIsRoundRobin(x.roundRobin)
                                                        setNewScheduleUsers(x.userIds)
                                                    }}
                                                > Edit </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[525px]">
                                                    <DialogHeader>
                                                    <DialogTitle>Edit Schedule</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your schedule here. Click save when you're done.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Name
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newScheduleName} onChange={(e)=>setNewScheduleName(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Description
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newScheduleDescription} onChange={(e)=>setNewScheduleDescription(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        On Call Rotation Period (Days)
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newOnCallRotationDays} onChange={(e)=>setNewOnCallRotationDays(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        On Call Rotation Round Robin
                                                        </Label>
                                                        <div className="col-span-3">
                                                        <Select onValueChange={(value)=>setNewIsRoundRobin(value==="True"?true:false)} defaultValue={x.roundRobin?"True":"False"}>
                                                            <SelectTrigger >
                                                                <SelectValue placeholder="" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="False">False</SelectItem>
                                                                <SelectItem value="True">True</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="username" className="text-right">
                                                        Users
                                                        </Label>
                                                        <div className="col-span-3">
                                                            <MultipleSelector options={userOptions} value={newScheduleUsers} setValue={setNewScheduleUsers}/>
                                                        </div>
                                                    </div>
                                                    { newScheduleUsers && newScheduleUsers.length > 0?
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        On Call
                                                        </Label>
                                                        <div className="col-span-3">
                                                        <Select onValueChange={(value)=>setNewOnCallUserId(value)} defaultValue={x.onCallUserId}>
                                                            <SelectTrigger >
                                                                <SelectValue placeholder="Select from users" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    userData.map((x)=>{
                                                                        if(newScheduleUsers.filter((y)=>y===x.id).length > 0)
                                                                        return <SelectItem value={x.id}>{x.name}</SelectItem>
                                                                    })

                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        </div>
                                                    </div>:null}
                                                    </div>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                    <Button type="submit" onClick={async()=>{
                                                        let newTeamData = {
                                                            id: x.id,
                                                            name: newScheduleName,
                                                            description: newScheduleDescription,
                                                            onCallUserId: newOnCallUserId,
                                                            onCallRotationDays: parseInt(newOnCallRotationDays),
                                                            roundRobin: newIsRoundRobin,
                                                            users: newScheduleUsers
                                                        }
                                                        console.log("edit schedule", newTeamData)

                                                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/schedules/"+x.id, {
                                                            method: 'PATCH',
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
                                                        This action cannot be undone. This will permanently delete your schedule.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={async()=>{
                                                            console.log(x.id)
                                                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/schedules/"+x.id, {
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

export default SchedulePage;
