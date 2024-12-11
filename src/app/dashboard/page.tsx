import { AppSidebar } from "@/components/app-sidebar"
import { useTheme } from "@/components/theme-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import IncidentPage from "../section/incidents"
import { useEffect, useState } from "react"
import PostmartumPage from "../section/postmartum"
import InsightsPage from "../section/insights"
import TeamsPage from "../section/teams"
import UsersPage from "../section/users"
import ServicesPage from "../section/services"
import SchedulePage from "../section/schedules"
import EscalationPage from "../section/escalation"
import EscalationFormPage from "../section/escalationPolicyForm"
import AiInsightsPage from "../section/aiInsights"




export default function Page() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("Call4Duty")
  const [subTitle, setSubTitle] = useState("Always on Duty")

  useEffect(()=>{
    const pathname = window.location.pathname;
    const name = pathname.split('/')[1]
    if(name === "incidents") {
      setTitle("Actions")
      setSubTitle("All Incidents")
    }
    if(name === "postmartum") {
      setTitle("Actions")
      setSubTitle("Postmartum")
    }
    if(name === "insights") {
      setTitle("Reporting")
      setSubTitle("Insights")
    }
    if(name === "aiinsights") {
      setTitle("Reporting")
      setSubTitle("AI Insights")
    }
    if(name === "userinsights") {
      setTitle("Reporting")
      setSubTitle("User Insights")
    }
    if(name === "teams") {
      setTitle("Entites")
      setSubTitle("Teams")
    }
    if(name === "users") {
      setTitle("Entites")
      setSubTitle("Users")
    }
    if(name === "services") {
      setTitle("Entites")
      setSubTitle("Services")
    }
    if(name === "schedules") {
      setTitle("Entites")
      setSubTitle("Schedules")
    }
    if(name === "escaltionPolicy") {
      setTitle("Entites")
      setSubTitle("Escalation Policy")
    }
  },[window.location.pathname])


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className={`-ml-1 ${theme == "light" ? "test-black": "text-white"}`} />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  {title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{subTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className={`flex flex-1 flex-col gap-4 p-4 ${theme=="light" ? "text-black":"text-white"}`}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<div>Welcome! choose option from sidebar </div>}/>
              <Route path='/incidents' element={<IncidentPage/>} />
              <Route path='/postmartum/:id' element={<PostmartumPage/>} />
              <Route path='/insights' element={<InsightsPage/>} />
              <Route path='/aiinsights' element={<AiInsightsPage/>} />
              <Route path='/teams' element={<TeamsPage/>} />
              <Route path='/users' element={<UsersPage/>} />
              <Route path='/services' element={<ServicesPage/>} />
              <Route path='/schedules' element={<SchedulePage/>} />
              <Route path='/escaltionPolicy' element={<EscalationPage/>} />
              <Route path='/escaltionPolicy/new' element={<EscalationFormPage newEntry={true}/>} />
              <Route path='/escaltionPolicy/:id' element={<EscalationFormPage newEntry={false}/>} />
            </Routes>
          </BrowserRouter>


        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
