"use client"


export type Teams = {
    id: string
    name: string
    users: string[]
    escaltionPolicy: string[]
  }

export type EscaltionPolicy = {
    id: string
    name: string
    description: string
    retryTime: Number
}

export type EscalationLevel = {
    id: string
    level: Number
    escalationPolicyId: string
    scheduleId: string
    userId: string
    gapOnRetry: Number
}

export type Service = {
    id: string
    name: string
    description: string
    teamId: string
    escalationPolicyId: string
}

export type User = {
    id: string
    name: string
    title: string
    phoneNumber: string
    email: string
    role: string
}

export type Schedule = {
    id: string;
    name: string;
    description: string;
    onCallUserId: string;
    onCallRotationDays: number;
    roundRobin: boolean;
    users: string[];
  };
  

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
