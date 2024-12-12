import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import React, { useState, useEffect } from "react";
import { teams, escalationPolicies } from "../../data/dummydata";
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
import { sleep } from "./entites";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultipleSelector } from "@/components/ui/multi-selector";
import { title } from "process";


const UsersPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newUserName, setNewUserName] = useState("");
  const [newUserTitle, setNewUserTitle] = useState("");
  const [newUserPhoneNumber, setNewUserPhoneNumber] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [users, setUsers] = useState([])
  const[up,setUp]= useState("")

  const fetchData = async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users/all"); // Example API call
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    fetchData();
  }, [up]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
        <div className="flex text-xl font-bold justify-between">
           All Users
           <br/>
           <br/>
        </div>

        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3">
            <div className="flex justify-end" >
            <Dialog>
                <DialogTrigger asChild>
                <Button onClick={()=>{
                    setNewUserName("")
                    setNewUserTitle("")
                    setNewUserPhoneNumber("")
                    setNewUserEmail("")
                    setNewUserRole("")
                }}>
                            <PlusIcon/> Create New User
                        </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Complete the form with user details. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input id="name" className="col-span-3" value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Title
                        </Label>
                        <Input id="name" className="col-span-3" value={newUserTitle} onChange={(e)=>setNewUserTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Phone Number
                        </Label>
                        <Input id="name" className="col-span-3" value={newUserPhoneNumber} onChange={(e)=>setNewUserPhoneNumber(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Email
                        </Label>
                        <Input id="name" className="col-span-3" value={newUserEmail} onChange={(e)=>setNewUserEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Role
                        </Label>
                        <Input id="name" className="col-span-3" value={newUserRole} onChange={(e)=>setNewUserRole(e.target.value)} />
                    </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                    <Button type="submit" onClick={async()=>{
                        let newUserData = {
                            name: newUserName,
                            title: newUserTitle,
                            phoneNumber: newUserPhoneNumber,
                            email: newUserEmail,
                            role: newUserRole
                        }
                        console.log("new user", newUserData)

                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users", {
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
                        <TableHead>Title</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell className="font-medium">{x.title}</TableCell>
                                        <TableCell className="font-medium">{x.phoneNumber}</TableCell>
                                        <TableCell className="font-medium">{x.email}</TableCell>
                                        <TableCell className="font-medium">{x.role}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="m-1"
                                                    onClick={()=>{
                                                        setNewUserName(x.name)
                                                        setNewUserTitle(x.title)
                                                        setNewUserPhoneNumber(x.phoneNumber)
                                                        setNewUserEmail(x.email)
                                                        setNewUserRole(x.role)
                                                    }}
                                                > Edit </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[525px]">
                                                    <DialogHeader>
                                                    <DialogTitle>Edit User</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your team here. Click save when you're done.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Name
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Title
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newUserTitle} onChange={(e)=>setNewUserTitle(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Phone Number
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newUserPhoneNumber} onChange={(e)=>setNewUserPhoneNumber(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Email
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newUserEmail} onChange={(e)=>setNewUserEmail(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                        Role
                                                        </Label>
                                                        <Input id="name" className="col-span-3" value={newUserRole} onChange={(e)=>setNewUserRole(e.target.value)} />
                                                    </div>
                                                    </div>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                    <Button type="submit" onClick={async()=>{
                                                        let newUserData = {
                                                            // id: x.id,
                                                            name: newUserName,
                                                            title: newUserTitle,
                                                            phoneNumber: newUserPhoneNumber,
                                                            email: newUserEmail,
                                                            role: newUserRole
                                                        }
                                                        console.log("edit user", newUserData)

                                                        await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users/"+x.id, {
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
                                                        This action cannot be undone. This will permanently delete your user.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={async()=>{
                                                            console.log(x.id)
                                                            await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users/"+x.id, {
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

export default UsersPage;
