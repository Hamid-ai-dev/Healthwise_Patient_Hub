
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScheduleAppointmentModal from '@/components/ScheduleAppointmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { appointmentService, AppointmentData } from '@/services/appointmentService';
import {
  CalendarClock,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar as CalendarIcon,
  Stethoscope,
  AlertCircle
} from 'lucide-react';

const AppointmentsPage = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  // State management
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Load appointments when component mounts
  useEffect(() => {
    if (user && token) {
      fetchAppointments();
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments(token!, {
        page: 1,
        limit: 50
      });
      setAppointments(response.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentScheduled = () => {
    fetchAppointments(); // Refresh appointments list
    toast({
      title: "Success",
      description: "Appointment scheduled successfully",
    });
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(token!, appointmentId, 'Cancelled by user');
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel appointment';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (appointment: AppointmentData) => {
    // For now, we'll show an alert with appointment details
    // This can be enhanced with a proper modal later
    const details = `
Appointment Details:
- ${user?.role === 'patient' ? 'Doctor' : 'Patient'}: ${user?.role === 'patient' ? appointment.doctorId.name : appointment.patientId.name}
- Date: ${formatDate(appointment.dateTime)}
- Time: ${formatTime(appointment.dateTime)}
- Duration: ${appointment.duration} minutes
- Type: ${appointment.type}
- Status: ${appointment.status}
- Reason: ${appointment.reason}
${appointment.symptoms ? `- Symptoms: ${appointment.symptoms}` : ''}
${appointment.notes ? `- Notes: ${appointment.notes}` : ''}
${appointment.doctorNotes ? `- Doctor's Notes: ${appointment.doctorNotes}` : ''}
    `.trim();

    alert(details);
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointmentStatus(token!, appointmentId, 'confirmed');
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment confirmed successfully",
      });
    } catch (error: any) {
      console.error('Error confirming appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to confirm appointment';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    const doctorNotes = prompt('Enter any notes for this completed appointment (optional):');

    try {
      await appointmentService.updateAppointmentStatus(token!, appointmentId, 'completed', {
        doctorNotes: doctorNotes || undefined
      });
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });
    } catch (error: any) {
      console.error('Error completing appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete appointment';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Filter appointments based on status
  const upcomingAppointments = appointments.filter(apt =>
    ['scheduled', 'confirmed', 'pending'].includes(apt.status) &&
    new Date(apt.dateTime) > new Date()
  );

  const pastAppointments = appointments.filter(apt =>
    apt.status === 'completed' ||
    apt.status === 'cancelled' ||
    new Date(apt.dateTime) <= new Date()
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">
              {user?.role === 'patient'
                ? 'Schedule and manage your medical appointments'
                : 'View and manage patient appointments'
              }
            </p>
          </div>
          {user?.role === 'patient' && (
            <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2">
              <CalendarClock size={16} />
              Schedule New Appointment
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">
              {user?.role === 'patient' ? 'Upcoming Appointments' : 'Scheduled Appointments'}
            </TabsTrigger>
            <TabsTrigger value="past">
              {user?.role === 'patient' ? 'Past Appointments' : 'Completed Appointments'}
            </TabsTrigger>
          </TabsList>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {user?.role === 'patient' ? 'Upcoming Appointments' : 'Scheduled Patient Appointments'}
                </CardTitle>
                <CardDescription>
                  {user?.role === 'patient'
                    ? 'Your scheduled appointments'
                    : 'Appointments scheduled with you'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading appointments...</span>
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment._id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-primary p-4 flex flex-col justify-center items-center text-primary-foreground md:w-1/4">
                            <CalendarIcon className="h-8 w-8 mb-2" />
                            <div className="text-center">
                              <p className="font-bold text-lg">
                                {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="text-sm opacity-90">
                                {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                                  weekday: 'long'
                                })}
                              </p>
                              <p className="text-lg mt-1">{formatTime(appointment.dateTime)}</p>
                            </div>
                          </div>

                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4" />
                                  {user?.role === 'patient'
                                    ? appointment.doctorId.name
                                    : appointment.patientId.name
                                  }
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.type} • {appointment.duration} minutes
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(appointment.status)}
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </div>
                              {appointment.symptoms && (
                                <div>
                                  <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                                </div>
                              )}
                              {appointment.notes && (
                                <div>
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Details
                              </Button>

                              {user?.role === 'patient' ? (
                                // Patient actions
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                  disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              ) : (
                                // Doctor actions
                                <div className="flex gap-2">
                                  {appointment.status === 'pending' && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleConfirmAppointment(appointment._id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Confirm
                                    </Button>
                                  )}
                                  {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleCompleteAppointment(appointment._id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment._id)}
                                    disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {user?.role === 'patient' ? 'No upcoming appointments' : 'No scheduled appointments'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {user?.role === 'patient'
                        ? "You don't have any scheduled appointments yet."
                        : "No patients have scheduled appointments with you yet."
                      }
                    </p>
                    {user?.role === 'patient' && (
                      <Button onClick={() => setIsScheduleModalOpen(true)}>
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Schedule Your First Appointment
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Past Appointments Tab */}
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Past Appointments
                </CardTitle>
                <CardDescription>
                  Your completed and cancelled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading appointments...</span>
                  </div>
                ) : pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <Card key={appointment._id} className="overflow-hidden opacity-75">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-muted p-4 flex flex-col justify-center items-center md:w-1/4">
                            <CalendarIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                            <div className="text-center">
                              <p className="font-bold text-lg">
                                {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                                  weekday: 'long'
                                })}
                              </p>
                              <p className="text-lg mt-1">{formatTime(appointment.dateTime)}</p>
                            </div>
                          </div>

                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4" />
                                  {user?.role === 'patient'
                                    ? appointment.doctorId.name
                                    : appointment.patientId.name
                                  }
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.type} • {appointment.duration} minutes
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(appointment.status)}
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </div>
                              {appointment.symptoms && (
                                <div>
                                  <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                                </div>
                              )}
                              {appointment.doctorNotes && (
                                <div>
                                  <span className="font-medium">Doctor's Notes:</span> {appointment.doctorNotes}
                                </div>
                              )}
                              {appointment.notes && (
                                <div>
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {user?.role === 'patient' ? 'No past appointments' : 'No completed appointments'}
                    </h3>
                    <p className="text-muted-foreground">
                      {user?.role === 'patient'
                        ? 'Your completed and cancelled appointments will appear here.'
                        : 'Completed and cancelled patient appointments will appear here.'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Schedule Appointment Modal - Only for patients */}
        {user?.role === 'patient' && (
          <ScheduleAppointmentModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            onAppointmentScheduled={handleAppointmentScheduled}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
