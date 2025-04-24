
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { doctors, patients } from '@/data/mockData';
import { Doctor } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  FileEdit,
  Users,
  Building,
  Award,
  BookOpen,
  Briefcase,
  Stethoscope,
  MessageSquare
} from "lucide-react";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch doctor's data
    if (user && user.id) {
      const doctor = doctors.find(d => d.id === user.id);
      if (doctor) {
        setDoctorData(doctor);
      }
      setLoading(false);
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Format doctor's availability
  const formatAvailability = (doctorData: Doctor) => {
    if (!doctorData.availability || doctorData.availability.length === 0) {
      return <p className="text-muted-foreground">No availability set</p>;
    }

    return (
      <div className="space-y-2">
        {doctorData.availability.map((slot, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="font-medium">{slot.day}</div>
            <div className="text-muted-foreground">{slot.startTime} - {slot.endTime}</div>
          </div>
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-healwise-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!doctorData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Doctor profile not found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't find your profile data. Please contact support.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate('/doctor-dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Doctor Profile</h1>
          {!isEditing ? (
            <Button onClick={handleEditProfile} className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Overview Card */}
        <Card className="relative">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={doctorData.image} />
                <AvatarFallback className="bg-healwise-blue text-white text-2xl">
                  {getInitials(doctorData.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{doctorData.name}</h2>
                  <Badge variant="outline" className="bg-blue-50 text-healwise-blue">
                    {doctorData.role.charAt(0).toUpperCase() + doctorData.role.slice(1)}
                  </Badge>
                </div>
                <p className="text-xl font-semibold text-muted-foreground">
                  {doctorData.specialty}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{doctorData.ratings}</span>
                  <span className="text-muted-foreground">({doctorData.reviews?.length || 0} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a href={`mailto:${doctorData.email}`}>
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Message</span>
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <UserRound className="h-5 w-5 text-healwise-blue" />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-muted-foreground">{doctorData.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-muted-foreground">(555) 123-4567</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Office Location</div>
                          <div className="text-muted-foreground">Main Hospital, Floor 3, Suite 305</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Hospital Affiliation</div>
                          <div className="text-muted-foreground">HealWise Medical Center</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-healwise-blue" />
                      Professional Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Specialty</div>
                          <div className="text-muted-foreground">{doctorData.specialty}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Education</div>
                          <div className="text-muted-foreground">University Medical School, MD</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Certifications</div>
                          <div className="text-muted-foreground">Board Certified in {doctorData.specialty}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="font-medium">Patients</div>
                          <div className="text-muted-foreground">{doctorData.patients?.length || 0} active patients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Biography</h3>
                  <p className="text-muted-foreground">
                    Dr. {doctorData.name.split(' ')[1]} is a dedicated {doctorData.specialty} specialist with years of experience in diagnosing and treating patients. 
                    They graduated from University Medical School and completed their residency at General Hospital. 
                    Dr. {doctorData.name.split(' ')[1]} is committed to providing compassionate and comprehensive care to all patients.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-healwise-blue" />
                        <CardTitle>Weekly Schedule</CardTitle>
                      </div>
                      <CardDescription>Your regular working hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {formatAvailability(doctorData)}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Update Schedule
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-healwise-blue" />
                        <CardTitle>Upcoming Appointments</CardTitle>
                      </div>
                      <CardDescription>Your next scheduled appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Today</div>
                          <div className="text-muted-foreground">2 appointments</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Tomorrow</div>
                          <div className="text-muted-foreground">3 appointments</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">This Week</div>
                          <div className="text-muted-foreground">8 appointments</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/appointments">View All Appointments</a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="patients" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-healwise-blue" />
                    Your Patients ({doctorData.patients?.length || 0})
                  </h3>
                  
                  {doctorData.patients && doctorData.patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctorData.patients.map((patientId) => {
                        const patientData = patients.find(p => p.id === patientId);
                        if (!patientData) return null;
                        
                        return (
                          <Card key={patientId}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={patientData.image} />
                                  <AvatarFallback className="bg-healwise-blue text-white">
                                    {getInitials(patientData.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{patientData.name}</div>
                                  <div className="text-sm text-muted-foreground">{patientData.email}</div>
                                </div>
                                <Button size="sm" variant="outline" className="ml-auto">
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No patients assigned</h3>
                      <p className="text-muted-foreground">You don't have any patients assigned to you yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
