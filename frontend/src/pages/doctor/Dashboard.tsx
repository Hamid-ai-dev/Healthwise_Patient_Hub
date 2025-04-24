
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  XCircle,
} from 'lucide-react';
import { patients, appointments } from '@/data/mockData';
import { Appointment, Patient } from '@/types';

const appointmentData = [
  { name: 'Mon', completed: 4, scheduled: 2 },
  { name: 'Tue', completed: 5, scheduled: 3 },
  { name: 'Wed', completed: 7, scheduled: 2 },
  { name: 'Thu', completed: 3, scheduled: 4 },
  { name: 'Fri', completed: 6, scheduled: 1 },
];

const patientDemographics = [
  { name: 'Male', value: 65 },
  { name: 'Female', value: 85 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#1E88E5', '#4CAF50', '#FF5722'];

const DoctorDashboard = () => {
  const { user, doctorData } = useAuth();
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [doctorPatients, setDoctorPatients] = useState<Patient[]>([]);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(0);
  
  useEffect(() => {
    // Load doctor-specific data if user is logged in
    if (user && user.id) {
      // Filter appointments for this doctor
      const filteredAppointments = appointments.filter(apt => apt.doctorId === user.id);
      setDoctorAppointments(filteredAppointments);
      setTotalAppointmentsCount(filteredAppointments.length);
      
      // Simulate total patients count for this doctor
      if (doctorData?.patients?.length) {
        setTotalPatientsCount(doctorData.patients.length);
        
        // Get patient details
        const doctorPatientsList = patients.filter(patient => 
          doctorData.patients?.includes(patient.id)
        );
        setDoctorPatients(doctorPatientsList);
      }
    }
  }, [user, doctorData]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get upcoming appointments for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysAppointments = doctorAppointments.filter(apt => {
    const aptDate = new Date(apt.dateTime);
    return aptDate >= today && aptDate < tomorrow;
  });
  
  // Get upcoming appointments beyond today
  const upcomingAppointments = doctorAppointments.filter(apt => {
    const aptDate = new Date(apt.dateTime);
    return aptDate >= tomorrow && apt.status === 'scheduled';
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's your practice overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
        </p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded">
                  <Calendar className="h-5 w-5 text-healwise-blue" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <h3 className="text-2xl font-bold">{todaysAppointments.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded">
                  <Users className="h-5 w-5 text-healwise-green" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <h3 className="text-2xl font-bold">{totalPatientsCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold">98%</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                  <h3 className="text-2xl font-bold">5</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column (Schedule and Stats) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Today's Appointments</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/appointments">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todaysAppointments.map((appointment) => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      return (
                        <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={patient?.image} />
                              <AvatarFallback className="bg-healwise-blue text-white">
                                {patient ? getInitials(patient.name) : 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{patient?.name || 'Unknown Patient'}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(appointment.dateTime)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={appointment.status === 'scheduled' ? 'outline' : 'default'}>
                              {appointment.status === 'scheduled' ? 'Upcoming' : 'Completed'}
                            </Badge>
                            <Button size="sm">Start</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-muted-foreground">No appointments scheduled for today</p>
                    <Button className="mt-4">View Schedule</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Performance & Statistics */}
            <Tabs defaultValue="appointments">
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Statistics</CardTitle>
                <TabsList>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="patients">Patients</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardDescription>Weekly appointment summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={appointmentData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="completed" name="Completed" fill="#1E88E5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="scheduled" name="Scheduled" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardDescription>Patient demographics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={patientDemographics}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {patientDemographics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex flex-wrap gap-4">
                        {patientDemographics.map((entry, index) => (
                          <div key={`legend-${index}`} className="flex items-center">
                            <div
                              className="w-3 h-3 mr-1"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{entry.name}: {entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column (Patients, Quick Actions) */}
          <div className="space-y-5">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/appointments" className="flex items-center">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment) => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      return (
                        <div key={appointment.id} className="flex items-start space-x-4">
                          <div className="p-2 bg-blue-50 rounded-full">
                            <Clock className="h-5 w-5 text-healwise-blue" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{patient?.name || 'Unknown Patient'}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(appointment.dateTime)}</p>
                            {appointment.notes && (
                              <p className="text-xs text-gray-500">Notes: {appointment.notes}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {upcomingAppointments.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="link" size="sm" asChild>
                          <Link to="/appointments">
                            View {upcomingAppointments.length - 3} more
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Patients */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Patients</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/patients" className="flex items-center">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctorPatients.slice(0, 3).map((patient) => (
                    <div key={patient.id} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={patient.image} />
                        <AvatarFallback className="bg-healwise-blue text-white">
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.healthMetrics?.lastUpdated ? `Last visit: ${new Date(patient.healthMetrics.lastUpdated).toLocaleDateString()}` : 'No recent visits'}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link to="/create-report">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create Medical Report
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Patient
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Schedule
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/patients">
                    <User className="mr-2 h-4 w-4" />
                    View Patient List
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="line-through text-muted-foreground">Review lab results for John Doe</p>
                      <p className="text-xs text-muted-foreground">Due 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-medium">Update medical records for Mike Johnson</p>
                      <p className="text-xs text-red-500">Overdue by 1 day</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                      <p>Approve prescription refill requests</p>
                      <p className="text-xs text-muted-foreground">Due tomorrow</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
