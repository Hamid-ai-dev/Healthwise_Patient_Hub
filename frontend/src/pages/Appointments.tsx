
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { patients, doctors } from '@/data/mockData';
import { Appointment, Doctor } from '@/types';
import {
  CalendarDays,
  Clock,
  X,
  Check,
  Bell,
  CalendarClock,
  Calendar as CalendarIcon,
  User,
  FileText,
  CheckCircle,
  XCircle,
  ClockIcon,
} from 'lucide-react';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const today = new Date();
  
  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0).toISOString(),
      status: 'scheduled',
      notes: 'Regular checkup',
    },
    {
      id: '2',
      patientId: 'patient-1',
      doctorId: 'doctor-2',
      dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 30).toISOString(),
      status: 'scheduled',
      notes: 'Discussion about test results',
    },
    {
      id: '3',
      patientId: 'patient-1',
      doctorId: 'doctor-3',
      dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 9, 0).toISOString(),
      status: 'completed',
      notes: 'Followup visit',
    },
    {
      id: '4',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 11, 0).toISOString(),
      status: 'cancelled',
      notes: 'Annual physical',
    },
  ]);
  
  // State for new appointment scheduling
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [step, setStep] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [reminders, setReminders] = useState([
    { id: 1, appointmentId: '1', time: '1 day before', enabled: true },
    { id: 2, appointmentId: '1', time: '1 hour before', enabled: true },
    { id: 3, appointmentId: '2', time: '2 days before', enabled: true },
  ]);
  
  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', 
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doc => doc.id === id) as Doctor | undefined;
  };
  
  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Convert selected time to hours and minutes
    const [hours, minutes] = selectedTime
      .replace(' AM', '')
      .replace(' PM', '')
      .split(':')
      .map(num => parseInt(num));
    
    // Adjust hours for PM
    const adjustedHours = selectedTime.includes('PM') && hours !== 12 ? hours + 12 : hours;
    
    // Create date object with selected date and time
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(adjustedHours, minutes);
    
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      patientId: user?.id || 'patient-1',
      doctorId: selectedDoctor,
      dateTime: appointmentDateTime.toISOString(),
      status: 'scheduled',
      notes: appointmentNotes,
    };
    
    setAppointments([...appointments, newAppointment]);
    
    // Add default reminders
    setReminders([
      ...reminders,
      { id: Date.now(), appointmentId: newAppointment.id, time: '1 day before', enabled: true },
      { id: Date.now() + 1, appointmentId: newAppointment.id, time: '1 hour before', enabled: true },
    ]);
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setSelectedDoctor('');
    setAppointmentNotes('');
    setStep(1);
    
    toast({
      title: "Appointment Scheduled",
      description: "Your appointment has been successfully scheduled",
    });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(
        appointments.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' } 
            : apt
        )
      );
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled",
      });
    }
  };
  
  const handleToggleReminder = (reminderId: number) => {
    setReminders(
      reminders.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, enabled: !reminder.enabled } 
          : reminder
      )
    );
    
    toast({
      title: "Reminder Updated",
      description: "Your appointment reminder has been updated",
    });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  const isDateInPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };
  
  const getAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getUpcomingAppointments = () => {
    return appointments.filter(apt => 
      apt.status === 'scheduled' && !isDateInPast(apt.dateTime)
    ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };
  
  const getPastAppointments = () => {
    return appointments.filter(apt => 
      apt.status === 'completed' || apt.status === 'cancelled' || isDateInPast(apt.dateTime)
    ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  };
  
  const getAppointmentReminders = (appointmentId: string) => {
    return reminders.filter(r => r.appointmentId === appointmentId);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Schedule and manage your medical appointments</p>
          </div>
          <Button onClick={() => setStep(1)} className="gap-2">
            <CalendarClock size={16} />
            Schedule New Appointment
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Your scheduled appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {getUpcomingAppointments().length > 0 ? (
                      <div className="space-y-4">
                        {getUpcomingAppointments().map((appointment) => {
                          const doctor = getDoctorById(appointment.doctorId);
                          
                          return (
                            <Card key={appointment.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="bg-healwise-blue p-4 flex flex-col justify-center items-center text-white md:w-1/4">
                                  <CalendarDays className="h-8 w-8 mb-2" />
                                  <div className="text-center">
                                    <p className="font-bold text-lg">{new Date(appointment.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    <p className="text-sm opacity-90">{new Date(appointment.dateTime).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                    <p className="text-lg mt-1">{formatTime(appointment.dateTime)}</p>
                                  </div>
                                </div>
                                
                                <div className="p-4 flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-lg">Dr. {doctor?.name}</h3>
                                      <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                                    </div>
                                    {getAppointmentStatusBadge(appointment.status)}
                                  </div>
                                  
                                  {appointment.notes && (
                                    <div className="mt-2 text-sm">
                                      <span className="font-medium">Notes:</span> {appointment.notes}
                                    </div>
                                  )}
                                  
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {getAppointmentReminders(appointment.id).map(reminder => (
                                      <Badge 
                                        key={reminder.id} 
                                        variant={reminder.enabled ? "default" : "outline"}
                                        className="cursor-pointer flex gap-1 items-center"
                                        onClick={() => handleToggleReminder(reminder.id)}
                                      >
                                        <Bell className="h-3 w-3 mr-1" />
                                        {reminder.time}
                                        {reminder.enabled ? <CheckCircle className="h-3 w-3 ml-1" /> : <XCircle className="h-3 w-3 ml-1" />}
                                      </Badge>
                                    ))}
                                    
                                    <Badge 
                                      variant="outline" 
                                      className="cursor-pointer"
                                      onClick={() => {
                                        const time = prompt('Enter reminder time (e.g., "30 minutes before")');
                                        if (time) {
                                          setReminders([
                                            ...reminders,
                                            { 
                                              id: Date.now(), 
                                              appointmentId: appointment.id, 
                                              time, 
                                              enabled: true 
                                            }
                                          ]);
                                          toast({
                                            title: "Reminder Added",
                                            description: `New reminder set for ${time}`,
                                          });
                                        }
                                      }}
                                    >
                                      + Add Reminder
                                    </Badge>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedAppointment(appointment)}
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                          You don't have any upcoming appointments scheduled. Would you like to schedule one now?
                        </p>
                        <Button onClick={() => setStep(1)}>
                          Schedule Appointment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAppointment ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Date & Time</h3>
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(selectedAppointment.dateTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTime(selectedAppointment.dateTime)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Doctor Information</h3>
                          {(() => {
                            const doctor = getDoctorById(selectedAppointment.doctorId);
                            return (
                              <div className="flex items-center gap-3">
                                <div className="bg-healwise-blue h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                                  {doctor?.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">Dr. {doctor?.name}</p>
                                  <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Status</h3>
                          <div className="flex items-center gap-2">
                            {selectedAppointment.status === 'scheduled' && (
                              <ClockIcon className="h-4 w-4 text-blue-500" />
                            )}
                            {selectedAppointment.status === 'completed' && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                            {selectedAppointment.status === 'cancelled' && (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>{selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}</span>
                          </div>
                        </div>
                        
                        {selectedAppointment.notes && (
                          <div>
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-sm">{selectedAppointment.notes}</p>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-semibold mb-2">Reminders</h3>
                          <div className="space-y-2">
                            {getAppointmentReminders(selectedAppointment.id).length > 0 ? (
                              getAppointmentReminders(selectedAppointment.id).map(reminder => (
                                <div key={reminder.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <span>{reminder.time}</span>
                                  </div>
                                  <Badge variant={reminder.enabled ? "default" : "outline"}>
                                    {reminder.enabled ? "Enabled" : "Disabled"}
                                  </Badge>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No reminders set</p>
                            )}
                          </div>
                        </div>
                        
                        {selectedAppointment.status === 'scheduled' && !isDateInPast(selectedAppointment.dateTime) && (
                          <Button 
                            variant="destructive" 
                            className="w-full mt-4"
                            onClick={() => handleCancelAppointment(selectedAppointment.id)}
                          >
                            Cancel Appointment
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Appointment Selected</h3>
                        <p className="text-muted-foreground">
                          Select an appointment to view details
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Past Appointments Tab */}
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
                <CardDescription>
                  Your completed and cancelled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getPastAppointments().length > 0 ? (
                  <div className="space-y-4">
                    {getPastAppointments().map((appointment) => {
                      const doctor = getDoctorById(appointment.doctorId);
                      
                      return (
                        <div 
                          key={appointment.id} 
                          className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div className={`p-4 md:w-32 flex flex-col justify-center items-center text-white ${
                            appointment.status === 'completed' 
                              ? 'bg-green-500' 
                              : appointment.status === 'cancelled' 
                              ? 'bg-red-500' 
                              : 'bg-yellow-500'
                          }`}>
                            <p className="font-bold text-lg">{new Date(appointment.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm">{formatTime(appointment.dateTime)}</p>
                          </div>
                          
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Dr. {doctor?.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              </div>
                              {getAppointmentStatusBadge(appointment.status)}
                            </div>
                            
                            {appointment.notes && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Notes:</span> {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
                    <p className="text-muted-foreground">
                      You don't have any past appointments
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Schedule Appointment Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Appointment</CardTitle>
                <CardDescription>
                  Book an appointment with a healthcare provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {doctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDoctor === doctor.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedDoctor(doctor.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                selectedDoctor === doctor.id
                                  ? 'bg-primary-foreground text-primary'
                                  : 'bg-healwise-blue'
                              }`}>
                                {doctor.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">Dr. {doctor.name}</p>
                                <p className={`text-sm ${
                                  selectedDoctor === doctor.id
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}>
                                  {doctor.specialty}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => setStep(2)} 
                        disabled={!selectedDoctor}
                      >
                        Next: Select Date & Time
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label className="mb-2 block">Select Date</Label>
                        <div className="border rounded-md p-2">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            fromDate={new Date()}
                            className="rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Select Time</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className="justify-center"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Reason for visit or additional information"
                        value={appointmentNotes}
                        onChange={(e) => setAppointmentNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)}
                      >
                        Back: Select Doctor
                      </Button>
                      
                      <Button 
                        onClick={() => setStep(3)} 
                        disabled={!selectedDate || !selectedTime}
                      >
                        Next: Review & Confirm
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-muted p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Doctor</span>
                          </div>
                          <span>
                            {(() => {
                              const doctor = getDoctorById(selectedDoctor);
                              return `Dr. ${doctor?.name} (${doctor?.specialty})`;
                            })()}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Date</span>
                          </div>
                          <span>
                            {selectedDate?.toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Time</span>
                          </div>
                          <span>{selectedTime}</span>
                        </div>
                        
                        {appointmentNotes && (
                          <div className="flex flex-col sm:flex-row justify-between pb-3 border-b">
                            <div className="flex items-start gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <span className="font-medium">Notes</span>
                            </div>
                            <span className="mt-2 sm:mt-0 sm:text-right">{appointmentNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Appointment Reminders</h3>
                          <p className="text-sm text-blue-800 mt-1">
                            You will receive reminders 1 day before and 1 hour before your appointment.
                            You can customize your reminders after scheduling.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)}
                      >
                        Back: Select Date & Time
                      </Button>
                      
                      <Button onClick={handleScheduleAppointment}>
                        Confirm & Schedule
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
