
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Calendar,
  FileText,
  MessageSquare,
  Search,
  Pill,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { appointments, prescriptions, medicalReports } from '@/data/mockData';
import { Appointment, MedicalReport, Prescription } from '@/types';

const chartData = [
  { name: 'Mon', value: 70 },
  { name: 'Tue', value: 75 },
  { name: 'Wed', value: 78 },
  { name: 'Thu', value: 72 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 82 },
  { name: 'Sun', value: 75 },
];

const PatientDashboard = () => {
  const { user, patientData } = useAuth();
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);
  const [patientReports, setPatientReports] = useState<MedicalReport[]>([]);

  useEffect(() => {
    // Load patient-specific data if user is logged in
    if (user && user.id) {
      // Filter appointments for this patient
      setPatientAppointments(appointments.filter(apt => apt.patientId === user.id));
      
      // Filter prescriptions for this patient
      setPatientPrescriptions(prescriptions.filter(presc => presc.patientId === user.id));
      
      // Filter medical reports for this patient
      setPatientReports(medicalReports.filter(report => report.patientId === user.id));
    }
  }, [user]);

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

  // Get upcoming appointments
  const upcomingAppointments = patientAppointments.filter(
    apt => apt.status === 'scheduled' && new Date(apt.dateTime) > new Date()
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your health information.</p>
        
        {/* Dashboard Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/appointments">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-10 w-10 text-healwise-blue mb-4" />
                <h3 className="text-xl font-semibold">Appointments</h3>
                <p className="text-muted-foreground">Book or manage visits</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/symptom-checker">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Search className="h-10 w-10 text-healwise-green mb-4" />
                <h3 className="text-xl font-semibold">Symptom Check</h3>
                <p className="text-muted-foreground">Get health insights</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/messages">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <MessageSquare className="h-10 w-10 text-healwise-blue mb-4" />
                <h3 className="text-xl font-semibold">Messages</h3>
                <p className="text-muted-foreground">Consult with doctors</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/medical-records">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-10 w-10 text-healwise-orange mb-4" />
                <h3 className="text-xl font-semibold">Medical Records</h3>
                <p className="text-muted-foreground">View health history</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Health Overview Tabs */}
            <Tabs defaultValue="overview">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Health Overview</h2>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Health Vitals</CardTitle>
                    <CardDescription>Your weekly health metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 5,
                            bottom: 5,
                            left: 5,
                          }}
                        >
                          <defs>
                            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#1E88E5" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#1E88E5" 
                            fillOpacity={1} 
                            fill="url(#color)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium">Heart Rate</p>
                        <p className="text-2xl font-semibold">{patientData?.healthMetrics?.heartRate || '--'} <span className="text-xs">bpm</span></p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-700 font-medium">Blood Pressure</p>
                        <p className="text-2xl font-semibold">{patientData?.healthMetrics?.bloodPressure || '--'}</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-xs text-amber-700 font-medium">Weight</p>
                        <p className="text-2xl font-semibold">{patientData?.healthMetrics?.weight || '--'} <span className="text-xs">kg</span></p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-700 font-medium">Blood Sugar</p>
                        <p className="text-2xl font-semibold">{patientData?.healthMetrics?.bloodSugar || '--'} <span className="text-xs">mg/dL</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Health Metrics</CardTitle>
                    <CardDescription>View and track your detailed health data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Height</span>
                        <span>{patientData?.healthMetrics?.height} cm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Weight</span>
                        <span>{patientData?.healthMetrics?.weight} kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">BMI</span>
                        <span>
                          {patientData?.healthMetrics?.height && patientData?.healthMetrics?.weight ? (
                            (patientData.healthMetrics.weight / Math.pow(patientData.healthMetrics.height/100, 2)).toFixed(1)
                          ) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Blood Pressure</span>
                        <span>{patientData?.healthMetrics?.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Heart Rate</span>
                        <span>{patientData?.healthMetrics?.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Blood Sugar</span>
                        <span>{patientData?.healthMetrics?.bloodSugar} mg/dL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Updated</span>
                        <span>{patientData?.healthMetrics?.lastUpdated ? new Date(patientData.healthMetrics.lastUpdated).toLocaleDateString() : '--'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full">Update Health Metrics</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Reports</CardTitle>
                    <CardDescription>Your recent medical test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {patientReports.length > 0 ? (
                      <div className="space-y-4">
                        {patientReports.map((report) => (
                          <div key={report.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{report.type}</h3>
                              <span className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.results}</p>
                            {report.aiAnalysis && (
                              <div className="bg-blue-50 p-3 rounded-md mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Activity className="h-4 w-4 text-healwise-blue" />
                                  <span className="text-xs font-medium text-healwise-blue">AI Analysis</span>
                                </div>
                                <p className="text-sm">{report.aiAnalysis}</p>
                              </div>
                            )}
                            <div className="mt-3">
                              <Button variant="outline" size="sm">View Full Report</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-muted-foreground">No medical reports available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Prescriptions */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Current Prescriptions</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/prescriptions">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patientPrescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {patientPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="flex items-start space-x-3">
                        <div className="bg-healwise-blue/10 p-2 rounded-full">
                          <Pill className="h-5 w-5 text-healwise-blue" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Prescription #{prescription.id}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(prescription.issueDate).toLocaleDateString()} - {new Date(prescription.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {prescription.medications.map((med, idx) => (
                              <div key={idx} className="text-sm">
                                <strong>{med.name}</strong>
                                <span className="text-gray-600"> ({med.dosage}) - {med.frequency} for {med.duration}</span>
                              </div>
                            ))}
                          </div>
                          {prescription.notes && (
                            <p className="text-xs text-gray-500 mt-1">Note: {prescription.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-muted-foreground">No active prescriptions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/appointments">Book New</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                        <div className="bg-healwise-blue/10 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-healwise-blue" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">Dr. Sarah Wilson</h4>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-healwise-blue">
                              View
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {formatDate(appointment.dateTime)}
                          </div>
                          {appointment.followUp && (
                            <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                              Follow-up
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-muted-foreground">No upcoming appointments</p>
                    <Button className="mt-4">Schedule Appointment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Health Tips */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-healwise-blue/10 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-healwise-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Stay Hydrated</h4>
                      <p className="text-sm text-gray-600">
                        Drink at least 8 glasses of water daily to maintain optimal health.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-healwise-green/10 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-healwise-green" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Regular Exercise</h4>
                      <p className="text-sm text-gray-600">
                        Aim for at least 30 minutes of moderate exercise most days of the week.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-healwise-orange/10 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-healwise-orange" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Balanced Diet</h4>
                      <p className="text-sm text-gray-600">
                        Include a variety of fruits and vegetables in every meal.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Check Symptoms
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Doctor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Medical Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
