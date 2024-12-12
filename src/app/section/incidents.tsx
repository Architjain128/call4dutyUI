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


import React, { useState, useEffect, useCallback } from "react";
import { teams } from "@/data/dummydata";

const IncidentPage: React.FC = () => {
  // const [data, setData] = useState<any>(null);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [escalationPolicyOptions, setEscalationPolicyOptions] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [epData, setEpData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [up, setUp] = useState("");
  const [loading, setLoading] = useState(true);

  // Memoize fetch functions to prevent recreation on every render
  const fetchEpData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/escalation-policies/all");
      const result = await response.json();
      setEpData(result);
      return result;
    } catch (error) {
      console.error("Error fetching escalation policies:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchTeamData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/teams/all");
      const result = await response.json();
      setTeamData(result);
      return result;
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchServicesData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/services/all");
      const result = await response.json();
      setServiceData(result);
      return result;
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }, []); // Empty dependency array

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://qa6-call-for-duty-global.sprinklr.com/api/pager/incidents/all");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching incidents:", error);
      return [];
    }
  }, []); // Empty dependency array

  // Memoize preprocessing to prevent unnecessary recalculations
  const preprocessData = useCallback((fetchedData, services, teamData) => {
    if (!fetchedData || !services || !teamData) return [];

    return fetchedData.map((x) => {
      const service = services.find((z) => 
        x.currentAssignment?.impactedServiceId === z.id
      );
      const team = teamData.find((z) => 
        x.id === service.teamId
      );

      return {
        id: x.id,
        title: x.title,
        service: service?.name || 'Unknown',
        createdAt: x.createdTime,
        priority: x.priority, // Add priority logic if needed
        status: x.status,
        team: team?.name || 'Unknown', // Add team logic if needed
      };
    });
  }, []); // Empty dependency array

  // Use a single useEffect with a flag to prevent multiple fetches
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [incidentData, , servicesData, teamData] = await Promise.all([
          fetchData(),
          fetchEpData(),
          fetchServicesData(),
          fetchTeamData()
        ]);

        // Only update state if component is still mounted
        if (isMounted) {
          const processedData = preprocessData(incidentData, servicesData, teamData);
          setData(processedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

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
