import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Loader2, CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { appointmentService, Doctor, AvailableSlot, CreateAppointmentData } from '@/services/appointmentService';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentScheduled: () => void;
}

const ScheduleAppointmentModal = ({ isOpen, onClose, onAppointmentScheduled }: ScheduleAppointmentModalProps) => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  // State management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form data
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('consultation');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [duration, setDuration] = useState<number>(30);

  // Load doctors when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchDoctors();
    }
  }, [isOpen, token]);

  // Load available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate && token) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate, duration, token]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await appointmentService.getAvailableDoctors(token!);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate || !token) return;

    try {
      setLoadingSlots(true);
      const dateString = selectedDate.toISOString().split('T')[0];
      const slots = await appointmentService.getAvailableSlots(token, selectedDoctor, dateString, duration);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot || !reason.trim() || !token) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const appointmentData: CreateAppointmentData = {
        doctorId: selectedDoctor,
        dateTime: selectedSlot,
        duration,
        type: appointmentType as any,
        reason: reason.trim(),
        symptoms: symptoms.trim() || undefined,
        notes: notes.trim() || undefined,
        priority: priority as any,
      };

      await appointmentService.createAppointment(token, appointmentData);

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });

      onAppointmentScheduled();
      handleClose();
    } catch (error: any) {
      console.error('Error scheduling appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to schedule appointment';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDoctor('');
    setSelectedDate(undefined);
    setSelectedSlot('');
    setAppointmentType('consultation');
    setReason('');
    setSymptoms('');
    setNotes('');
    setPriority('medium');
    setDuration(30);
    setAvailableSlots([]);
    onClose();
  };

  const nextStep = () => {
    if (step === 1 && selectedDoctor) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedSlot) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceedToStep2 = selectedDoctor;
  const canProceedToStep3 = selectedDate && selectedSlot;
  const canSchedule = reason.trim();

  const selectedDoctorData = doctors.find(doc => doc._id === selectedDoctor);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule New Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step > stepNumber ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4" />
                <h3 className="text-lg font-medium">Select Doctor</h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading doctors...</span>
                </div>
              ) : (
                <div className="grid gap-3">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDoctor === doctor._id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDoctor(doctor._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        </div>
                        <Badge variant="secondary">Doctor</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date and Time */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" />
                <h3 className="text-lg font-medium">Select Date & Time</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Duration</Label>
                      <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Available Time Slots</Label>
                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Loading slots...</span>
                        </div>
                      ) : selectedDate ? (
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot.dateTime}
                              variant={selectedSlot === slot.dateTime ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedSlot(slot.dateTime)}
                            >
                              {slot.time}
                            </Button>
                          ))}
                          {availableSlots.length === 0 && (
                            <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                              No available slots for this date
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Please select a date first</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Appointment Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4" />
                <h3 className="text-lg font-medium">Appointment Details</h3>
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Appointment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Doctor:</strong> {selectedDoctorData?.name}</p>
                  <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {availableSlots.find(slot => slot.dateTime === selectedSlot)?.time}</p>
                  <p><strong>Duration:</strong> {duration} minutes</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="checkup">Checkup</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of the reason for your visit"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                  <Textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe any symptoms you're experiencing"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information you'd like to share"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !canProceedToStep2) ||
                    (step === 2 && !canProceedToStep3)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleScheduleAppointment}
                  disabled={!canSchedule || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Appointment'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentModal;
