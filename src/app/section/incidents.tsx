import { Incidents, columns } from "./columns"
import { DataTable } from "./data-table"
import Loader from "@/components/loader";
import { BK_URL } from "../constants";

export const generateDummyIncidents = (count: number): Incidents[] => {
    const statuses = ["Acknowleded", "Resolved", "Escalated", "Unknown"] as const;
    const priorities = ["Low", "Medium", "High", "Critical"];
    const services = ["Authentication", "Database", "API Gateway", "Frontend", "Backend"];
    const teams = ["Team1", "Team2", "Team3", "Team4"];
  
    return Array.from({ length: count }, (_, index) => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomTeams = teams[Math.floor(Math.random() * teams.length)];
  
      return {
        id: `INC-${index + 1}`,
        title: `Incident ${index + 1}`,
        service: randomService,
        createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(), // Random past date
        priority: randomPriority,
        status: randomStatus,
        team: randomTeams,
      };
    });
  };
  
async function getData(): Promise<Incidents[]> {
  // Fetch data from your API here.
  return generateDummyIncidents(100)
}


import React, { useState, useEffect } from "react";

const IncidentPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {



    const corsProxy = 'http://localhost:8080/';
    const apiUrl = BK_URL;
    


    const fetchData = async () => {
      try {
        // const response = await fetch("/api"); // Example API call
        // const result = await response
        // console.log(result);
        // setData(result);

        fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/users", {
          method: 'POST',  // or 'POST', depending on your request type
          headers: {
            'Content-Type': 'application/json',  // Ensure content type is correct
            'X-Requested-With': 'XMLHttpRequest',  // Add this header
            'Origin': "http://localhost:5173",
            'Access-Control-Allow-Origin':"*"  // Origin of your frontend app
          },
          mode:'no-cors'
        })
        .then(response => console.log("dsf", response))
        .then(data => console.log("dsf", data))
        .catch(error => console.error('Error:', error));
  
        


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
           All Incidents
        </div>
        <DataTable columns={columns} data={data} readonly={false} />
    </div>
  );
};

export default IncidentPage;
