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


  import { escalationPolicies} from "../../data/dummydata";
  import { Button } from "@/components/ui/button";
  import { PlusIcon } from "lucide-react";

import React, { useState, useEffect } from "react";

const EscalationPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div>
        <div className="flex-1 text-xl font-bold">
           All Escalation Policy
        </div>
        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3">
            <div className="flex justify-end" >
    
                <Button onClick={()=>{
                  window.location.pathname="/escaltionPolicy/new"
                }}>
                    <PlusIcon/> Create New Escalation Policy
                </Button>
          
      
          </div>
         
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            escalationPolicies.map((x)=>{
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">{x.name}</TableCell>
                                        <TableCell className="font-medium">{x.description}</TableCell>
                                        <TableCell className="text-right">
                                        <Button variant="secondary" size="sm" className="m-1" onClick={()=>{}} > Edit </Button>
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

export default EscalationPage;
