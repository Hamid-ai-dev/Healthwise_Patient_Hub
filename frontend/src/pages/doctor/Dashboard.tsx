import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Ensure path is correct
import DashboardLayout from '@/components/layout/DashboardLayout'; // Ensure path is correct
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Ensure path is correct
import { Button } from '@/components/ui/button'; // Ensure path is correct
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure path is correct
import { Badge } from '@/components/ui/badge'; // Ensure path is correct
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'; // Ensure path is correct
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  Clock,
  Users,
  User,
  MessageSquare,
  Activity,
  FilePlus,
  ChevronRight,
  CheckCircle,
  AlertCircle, // Keep AlertCircle for errors/overdue
  Loader2,
} from 'lucide-react';
import { patients, appointments } from '@/data/mockData'; // Still used for detailed lists - ensure path is correct
import { Appointment, Patient } from '@/types'; // Still used for detailed lists - ensure path is correct

// --- Interfaces for API Responses ---
interface CountResponse {
  count: number;
}
interface RateResponse {
  rate: number;
}
interface AppointmentStatItem {
  name: string;
  completed: number;
  scheduled: number;
}
interface AppointmentStatsResponse {
  weeklyAppointmentSummary: AppointmentStatItem[];
}
interface PatientStatItem {
  name: string;
  value: number;
}
interface PatientStatsResponse {
  patientDemographics: PatientStatItem[];
}
interface TaskItem {
  id: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  dueDate?: string;
}
interface PendingTasksResponse {
  tasks: TaskItem[];
}
// --- End Interfaces ---

const COLORS = ['#1E88E5', '#4CAF50', '#FF5722'];

const DoctorDashboard = () => {
  const { user, token, doctorData } = useAuth();

  // --- State for API Data ---
  const [apiTodaysAppointmentsCount, setApiTodaysAppointmentsCount] = useState<number | null>(null);
  const [apiTotalPatientsCount, setApiTotalPatientsCount] = useState<number | null>(null);
  const [apiCompletionRate, setApiCompletionRate] = useState<number | null>(null);
  const [apiNewMessagesCount, setApiNewMessagesCount] = useState<number | null>(null);
  const [apiAppointmentStats, setApiAppointmentStats] = useState<AppointmentStatItem[]>([]);
  const [apiPatientStats, setApiPatientStats] = useState<PatientStatItem[]>([]);
  const [apiPendingTasks, setApiPendingTasks] = useState<TaskItem[]>([]);
  // --- End State for API Data ---

  // --- Loading & Error States ---
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  // --- End Loading & Error States ---

  // --- State & Logic using Mock Data (for detailed lists as in original) ---
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [doctorPatients, setDoctorPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (user && user.id) {
      const filteredAppointments = appointments.filter(apt => apt.doctorId === user.id);
      setDoctorAppointments(filteredAppointments);
      if (doctorData?.patients?.length) {
        const doctorPatientsList = patients.filter(patient =>
          doctorData.patients?.includes(patient.id)
        );
        setDoctorPatients(doctorPatientsList);
      } else {
        setDoctorPatients([]);
      }
    } else {
      setDoctorAppointments([]);
      setDoctorPatients([]);
    }
  }, [user, doctorData]); // Removed appointments, patients from deps as they are stable imports

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    try {
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return "Invalid Date";
    }
  };

  const getTodaysAppointmentsList = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    return doctorAppointments.filter(apt => {
      try { const aptDate = new Date(apt.dateTime); return aptDate >= today && aptDate < tomorrow; }
      catch (e) { return false; }
    });
  };

  const getUpcomingAppointmentsList = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    return doctorAppointments.filter(apt => {
       try { const aptDate = new Date(apt.dateTime); return aptDate >= tomorrow && apt.status === 'scheduled'; }
       catch (e) { return false; }
    });
  }

  const getInitials = (name: string | undefined): string => {
    return name?.split(' ').map(part => part[0]).join('').toUpperCase() || '';
  };

  const todaysAppointmentsList = getTodaysAppointmentsList();
  const upcomingAppointmentsList = getUpcomingAppointmentsList();
  // --- End Mock Data Logic ---

  // --- API Fetching Logic ---
  const isMounted = useRef(true);

  useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    // --- !!! CRITICAL: VERIFY THIS URL !!! ---
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const DOCTOR_DASHBOARD_URL = `${API_BASE_URL}/doctor/dashboard`;
    // --- !!! ---

    console.log('Frontend attempting to fetch from:', DOCTOR_DASHBOARD_URL); // Frontend log

    const fetchData = async () => {
      if (!token || !user) {
        if (isMounted.current) {
          setLoadingCounts(false); setLoadingStats(false); setLoadingTasks(false);
          setErrorCounts("Not authenticated."); setErrorStats("Not authenticated."); setErrorTasks("Not authenticated.");
          console.warn("Auth token or user missing, aborting fetch."); // Frontend log
        }
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      setErrorCounts(null); setErrorStats(null); setErrorTasks(null);
      setLoadingCounts(true); setLoadingStats(true); setLoadingTasks(true);

      // Fetch counts
      try {
        const [todayApptRes, totalPatientsRes, completionRateRes, newMessagesRes] = await Promise.all([
          axios.get<CountResponse>(`${DOCTOR_DASHBOARD_URL}/todays-appointments`, config),
          axios.get<CountResponse>(`${DOCTOR_DASHBOARD_URL}/total-patients`, config),
          axios.get<RateResponse>(`${DOCTOR_DASHBOARD_URL}/completion-rate`, config),
          axios.get<CountResponse>(`${DOCTOR_DASHBOARD_URL}/new-messages`, config),
        ]);
         if (isMounted.current) {
            setApiTodaysAppointmentsCount(todayApptRes.data.count);
            setApiTotalPatientsCount(totalPatientsRes.data.count);
            setApiCompletionRate(completionRateRes.data.rate);
            setApiNewMessagesCount(newMessagesRes.data.count);
         }
      } catch (err: any) {
        console.error("Error fetching counts:", err.response?.data || err.message); // Log specific error
        if (isMounted.current) setErrorCounts("Failed to load summary.");
      } finally {
         if (isMounted.current) setLoadingCounts(false);
      }

      // Fetch Stats
      try {
        const [apptStatsRes, patientStatsRes] = await Promise.all([
            axios.get<AppointmentStatsResponse>(`${DOCTOR_DASHBOARD_URL}/stats/appointments`, config),
            axios.get<PatientStatsResponse>(`${DOCTOR_DASHBOARD_URL}/stats/patients`, config)
        ]);
         if (isMounted.current) {
            setApiAppointmentStats(apptStatsRes.data.weeklyAppointmentSummary);
            setApiPatientStats(patientStatsRes.data.patientDemographics);
         }
      } catch (err: any) {
          console.error("Error fetching stats:", err.response?.data || err.message); // Log specific error
          if (isMounted.current) setErrorStats("Failed to load statistics.");
      } finally {
          if (isMounted.current) setLoadingStats(false);
      }

      // Fetch Pending Tasks
      try {
        const tasksRes = await axios.get<PendingTasksResponse>(`${DOCTOR_DASHBOARD_URL}/pending-tasks`, config);
         if (isMounted.current) setApiPendingTasks(tasksRes.data.tasks);
      } catch (err: any) {
        console.error("Error fetching tasks:", err.response?.data || err.message); // Log specific error
         if (isMounted.current) setErrorTasks("Failed to load pending tasks.");
      } finally {
         if (isMounted.current) setLoadingTasks(false);
      }
    };

    fetchData();

  }, [token, user]);
  // --- End API Fetching Logic ---

  // --- Helper Functions for Rendering API Data ---
  const renderCount = (count: number | null, loading: boolean) => {
    if (loading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
    return count !== null ? count : '-';
  };

   const formatTaskDueDate = (dueDate?: string, status?: string) => {
      if (!dueDate) return status === 'completed' ? 'Completed' : 'No due date';
      try {
        const date = new Date(dueDate);
        const now = new Date();
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const timeDiff = dateOnly.getTime() - nowOnly.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const isOverdue = status === 'overdue' || (status !== 'completed' && dateOnly < nowOnly);
        if (status === 'completed') return `Completed`;
        if (isOverdue) {
          const daysOverdue = Math.abs(daysDiff);
          return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
        } else {
          if (daysDiff === 0) return 'Due today';
          if (daysDiff === 1) return 'Due tomorrow';
          return `Due in ${daysDiff} days`;
        }
      } catch (e) {
        return "Invalid Due Date";
      }
   };
  // --- End Helper Functions ---


  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Doctor'}</h1>
        <p className="text-muted-foreground">
          Here's your practice overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
        </p>

        {/* Consolidated Error Banner */}
        {(errorCounts || errorStats || errorTasks) && (
             <Card className="border-red-500 bg-red-50/50">
                <CardContent className="p-3 text-sm text-red-700 flex items-center gap-2">
                   <AlertCircle className="h-5 w-5 flex-shrink-0" />
                   {/* More specific error message based on context */}
                   <span>{ errorCounts && "Failed to load summary data." } { errorStats && "Failed to load statistics."} { errorTasks && "Failed to load tasks."} Please try refreshing.</span>
                   {/* Generic Message: <span>Failed to load some dashboard data. Please try refreshing.</span> */}
                </CardContent>
             </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card Today's Appointments */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded"><Calendar className="h-5 w-5 text-healwise-blue" /></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <h3 className="text-2xl font-bold h-8 flex items-center">{renderCount(apiTodaysAppointmentsCount, loadingCounts)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Card Total Patients */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded"><Users className="h-5 w-5 text-healwise-green" /></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <h3 className="text-2xl font-bold h-8 flex items-center">{renderCount(apiTotalPatientsCount, loadingCounts)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Card Completion Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded"><Activity className="h-5 w-5 text-amber-600" /></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold h-8 flex items-center">
                    {loadingCounts ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : apiCompletionRate !== null ? `${apiCompletionRate}%` : '-'}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Card New Messages */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded"><MessageSquare className="h-5 w-5 text-purple-600" /></div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                  <h3 className="text-2xl font-bold h-8 flex items-center">{renderCount(apiNewMessagesCount, loadingCounts)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column (Schedule and Stats) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Today's Schedule List (Uses Mock Data as per original) */}
            <Card>
              <CardHeader className="pb-3"><div className="flex justify-between items-center"><CardTitle>Today's Appointments</CardTitle><Button variant="outline" size="sm" asChild><Link to="/appointments">View All</Link></Button></div></CardHeader>
              <CardContent>
                {todaysAppointmentsList.length > 0 ? (<div className="space-y-4">{todaysAppointmentsList.map((appointment) => { const patient = patients.find(p => p.id === appointment.patientId); return (
                    <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-b-0"><div className="flex items-center space-x-3"><Avatar className="h-10 w-10"><AvatarImage src={patient?.image} /><AvatarFallback className="bg-healwise-blue text-white">{patient ? getInitials(patient.name) : 'P'}</AvatarFallback></Avatar><div><div className="font-medium">{patient?.name || 'Unknown Patient'}</div><div className="text-sm text-muted-foreground">{formatDate(appointment.dateTime)}</div></div></div><div className="flex items-center gap-2"><Badge variant={appointment.status === 'scheduled' ? 'outline' : 'default'}>{appointment.status === 'scheduled' ? 'Upcoming' : 'Completed'}</Badge><Button size="sm">Start</Button></div></div>);})}</div>
                ) : (<div className="text-center py-8"><Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" /><p className="text-muted-foreground">No appointments scheduled for today</p><Button className="mt-4" asChild><Link to="/appointments">View Schedule</Link></Button></div>)}
              </CardContent>
            </Card>

            {/* Statistics (Uses API Data) */}
            <Tabs defaultValue="appointments">
              <div className="flex justify-between items-center mb-4"><CardTitle>Statistics</CardTitle><TabsList><TabsTrigger value="appointments">Appointments</TabsTrigger><TabsTrigger value="patients">Patients</TabsTrigger></TabsList></div>
              <TabsContent value="appointments">
                <Card>
                  <CardHeader><CardDescription>Weekly appointment summary (Mon-Fri)</CardDescription></CardHeader>
                  <CardContent>
                     {loadingStats ? (<div className="h-[300px] flex items-center justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading Appointment Stats...</div>
                     ) : errorStats ? (<div className="h-[300px] flex items-center justify-center text-red-600 gap-2"><AlertCircle className="h-6 w-6"/> {errorStats}</div>
                     ) : apiAppointmentStats.length > 0 ? (<div className="h-[300px] mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={apiAppointmentStats} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="completed" name="Completed" fill="#1E88E5" radius={[4, 4, 0, 0]} /><Bar dataKey="scheduled" name="Scheduled" fill="#4CAF50" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                     ) : (<div className="h-[300px] flex items-center justify-center text-muted-foreground">No appointment data for this period.</div>)}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="patients">
                <Card>
                  <CardHeader><CardDescription>Patient demographics</CardDescription></CardHeader>
                  <CardContent>
                    {loadingStats ? (<div className="h-[300px] flex items-center justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading Patient Stats...</div>
                    ) : errorStats ? (<div className="h-[300px] flex items-center justify-center text-red-600 gap-2"><AlertCircle className="h-6 w-6"/> {errorStats}</div>
                    ) : apiPatientStats.some(p => p.value > 0) ? ( <> <div className="h-[300px] flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={apiPatientStats} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''} outerRadius={80} fill="#8884d8" dataKey="value">{apiPatientStats.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value, name) => [`${value} Patients`, name]} /></PieChart></ResponsiveContainer></div><div className="flex justify-center mt-4"><div className="flex flex-wrap gap-4">{apiPatientStats.map((entry, index) => ( entry.value > 0 && <div key={`legend-${index}`} className="flex items-center"><div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} /> <span className="text-sm">{entry.name}: {entry.value}</span> </div>))}</div></div> </>
                    ) : (<div className="h-[300px] flex items-center justify-center text-muted-foreground">No patient demographic data available.</div>)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Upcoming Appointments List (Uses Mock Data as per original) */}
            <Card>
              <CardHeader className="pb-3"><div className="flex justify-between items-center"><CardTitle>Upcoming</CardTitle><Button variant="ghost" size="sm" asChild><Link to="/appointments" className="flex items-center"> View all <ChevronRight className="h-4 w-4 ml-1" /></Link></Button></div></CardHeader>
              <CardContent>
                {upcomingAppointmentsList.length > 0 ? (<div className="space-y-4">{upcomingAppointmentsList.slice(0, 3).map((appointment) => { const patient = patients.find(p => p.id === appointment.patientId); return (<div key={appointment.id} className="flex items-start space-x-4"><div className="p-2 bg-blue-50 rounded-full"><Clock className="h-5 w-5 text-healwise-blue" /></div><div className="space-y-1"><p className="font-medium">{patient?.name || 'Unknown Patient'}</p><p className="text-sm text-muted-foreground">{formatDate(appointment.dateTime)}</p>{appointment.notes && (<p className="text-xs text-gray-500">Notes: {appointment.notes}</p>)}</div></div>);})}{upcomingAppointmentsList.length > 3 && (<div className="text-center pt-2"><Button variant="link" size="sm" asChild><Link to="/appointments"> View {upcomingAppointmentsList.length - 3} more </Link></Button></div>)}</div>
                ) : (<div className="text-center py-6"><p className="text-muted-foreground">No upcoming appointments</p></div>)}
              </CardContent>
            </Card>

            {/* Recent Patients List (Uses Mock Data as per original) */}
            <Card>
              <CardHeader className="pb-3"><div className="flex justify-between items-center"><CardTitle>Recent Patients</CardTitle><Button variant="ghost" size="sm" asChild><Link to="/patients" className="flex items-center"> View all <ChevronRight className="h-4 w-4 ml-1" /></Link></Button></div></CardHeader>
              <CardContent>
                 {doctorPatients.length > 0 ? (<div className="space-y-4">{doctorPatients.slice(0, 3).map((patient) => (<div key={patient.id} className="flex items-center space-x-3"><Avatar className="h-10 w-10"><AvatarImage src={patient.image} /><AvatarFallback className="bg-healwise-blue text-white">{getInitials(patient.name)}</AvatarFallback></Avatar><div className="flex-1"><div className="font-medium">{patient.name}</div><div className="text-sm text-muted-foreground">{patient.healthMetrics?.lastUpdated ? `Last visit: ${new Date(patient.healthMetrics.lastUpdated).toLocaleDateString()}` : 'No recent visits'}</div></div><Button variant="ghost" size="sm" className="shrink-0" asChild><Link to={`/patients/${patient.id}`}>View</Link></Button></div>))}</div>
                 ) : (<div className="text-center py-6"><p className="text-muted-foreground">No recent patients found.</p></div>)}
              </CardContent>
            </Card>

            {/* Quick Actions (Static as per original) */}
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2"><Button className="w-full justify-start" asChild><Link to="/create-report"> <FilePlus className="mr-2 h-4 w-4" /> Create Medical Report </Link></Button><Button variant="outline" className="w-full justify-start" asChild><Link to="/messages"> <MessageSquare className="mr-2 h-4 w-4" /> Message Patient </Link></Button><Button variant="outline" className="w-full justify-start" asChild><Link to="/appointments"> <Calendar className="mr-2 h-4 w-4" /> Manage Schedule </Link></Button><Button variant="outline" className="w-full justify-start" asChild><Link to="/patients"> <User className="mr-2 h-4 w-4" /> View Patient List </Link></Button></CardContent>
            </Card>

            {/* Pending Tasks (Uses API Data) */}
            <Card>
              <CardHeader className="pb-3"><CardTitle>Pending Tasks</CardTitle></CardHeader>
              <CardContent>
                 {loadingTasks ? (<div className="flex items-center justify-center text-muted-foreground py-6"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading Tasks...</div>
                 ) : errorTasks ? (<div className="flex items-center justify-center text-red-600 py-6 gap-2"><AlertCircle className="h-5 w-5"/> {errorTasks}</div>
                 ) : apiPendingTasks.length > 0 ? (<div className="space-y-4">{apiPendingTasks.map((task) => (<div key={task.id} className="flex items-start space-x-3">{task.status === 'completed' ? (<CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />) : task.status === 'overdue' ? (<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />) : (<Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />)}<div className="space-y-0.5 flex-grow"><p className={`leading-tight ${task.status === 'completed' ? 'line-through text-muted-foreground' : task.status === 'overdue' ? 'font-medium' : ''}`}>{task.description}</p><p className={`text-xs ${task.status === 'overdue' ? 'text-red-500' : 'text-muted-foreground'}`}>{formatTaskDueDate(task.dueDate, task.status)}</p></div></div>))}</div>
                 ) : (<div className="text-center text-muted-foreground py-6">No pending tasks.</div>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;