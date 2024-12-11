import { Teams, User, Service, EscalationLevel, EscaltionPolicy, Schedule } from "@/app/section/entites"

var user = {
    name: "Archit Jain",
    email: "archit.jain@call4duty.com",
    avatar: "/avatars/shadcn.jpg",
}


// Dummy Data for Users
export const users: User[] = [
    {
      id: "user1",
      name: "Alice Johnson",
      title: "Software Engineer",
      phoneNumber: "555-1234",
      email: "alice.johnson@example.com",
      role: "Developer",
    },
    {
      id: "user2",
      name: "Bob Smith",
      title: "Product Manager",
      phoneNumber: "555-5678",
      email: "bob.smith@example.com",
      role: "Manager",
    },
    {
      id: "user3",
      name: "Charlie Davis",
      title: "DevOps Engineer",
      phoneNumber: "555-8765",
      email: "charlie.davis@example.com",
      role: "DevOps",
    },
    {
      id: "user4",
      name: "Diana Prince",
      title: "QA Engineer",
      phoneNumber: "555-4321",
      email: "diana.prince@example.com",
      role: "QA",
    },
    {
      id: "user5",
      name: "Ethan Hunt",
      title: "Support Specialist",
      phoneNumber: "555-6789",
      email: "ethan.hunt@example.com",
      role: "Support",
    },
  ]
  
  // Dummy Data for Escalation Policies
  export const escalationPolicies: EscaltionPolicy[] = [
    {
      id: "ep1",
      name: "Standard Escalation",
      description: "Default escalation policy for standard incidents.",
      retryTime: 1
    },
    {
      id: "ep2",
      name: "Critical Escalation",
      description: "Escalation policy for critical incidents requiring immediate attention.",
      retryTime: 4
    },
  ]
  
  // Dummy Data for Teams
  export const teams: Teams[] = [
    {
      id: "team1",
      name: "Development Team",
      users: ["user1", "user2", "user3"],
      escaltionPolicy: ["ep1"],
    },
    {
      id: "team2",
      name: "QA Team",
      users: ["user4"],
      escaltionPolicy: ["ep1", "ep2"],
    },
    {
      id: "team3",
      name: "Support Team",
      users: ["user5"],
      escaltionPolicy: ["ep2"],
    },
  ]
  
  // Dummy Data for Escalation Levels
  export const escalationLevels: EscalationLevel[] = [
    {
      id: "el1",
      level: 1,
      escalationPolicyId: "ep1",
      scheduleId: "sched1",
      userId: "user1",
      gapOnRetry: 1
    },
    {
      id: "el2",
      level: 2,
      escalationPolicyId: "ep1",
      scheduleId: "sched1",
      userId: "user2",
      gapOnRetry: 2
    },
    {
      id: "el3",
      level: 1,
      escalationPolicyId: "ep2",
      scheduleId: "sched2",
      userId: "user3",
      gapOnRetry: 1
    },
    {
      id: "el4",
      level: 2,
      escalationPolicyId: "ep2",
      scheduleId: "sched2",
      userId: "user4",
      gapOnRetry: 4
    },
    {
      id: "el5",
      level: 3,
      escalationPolicyId: "ep2",
      scheduleId: "sched2",
      userId: "user5",
      gapOnRetry: 10
    },
  ]
  
  // Dummy Data for Services
  export const services: Service[] = [
    {
      id: "service1",
      name: "Authentication Service",
      description: "Handles user authentication and authorization.",
      teamId: "team1",
      escalationPolicyId: "ep1",
    },
    {
      id: "service2",
      name: "Payment Gateway",
      description: "Processes all payment transactions.",
      teamId: "team1",
      escalationPolicyId: "ep2",
    },
    {
      id: "service3",
      name: "User Interface",
      description: "Frontend interface for users.",
      teamId: "team2",
      escalationPolicyId: "ep1",
    },
    {
      id: "service4",
      name: "Customer Support",
      description: "Handles customer inquiries and issues.",
      teamId: "team3",
      escalationPolicyId: "ep2",
    },
  ]
  
  export const schedules: Schedule[] = [
    {
      id: "1",
      name: "Primary Support Schedule",
      description: "Schedule for primary on-call support rotation.",
      onCallUserId: "user1",
      onCallRotationDays: 7,
      roundRobin: true,
      users: ["user1", "user2", "user3"]
    },
    {
      id: "2",
      name: "Secondary Support Schedule",
      description: "Backup on-call schedule for secondary team members.",
      onCallUserId: "user4",
      onCallRotationDays: 14,
      roundRobin: false,
      users: ["user4", "user3"]
    },
    {
      id: "3",
      name: "DevOps On-Call",
      description: "DevOps team on-call rotation schedule.",
      onCallUserId: "user3",
      onCallRotationDays: 3,
      roundRobin: true,
      users: ["user3", "user5", "user1", "user2"]
    }
  ];
  


export {
    user
}