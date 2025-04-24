
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Patient } from '@/types';
import { patients } from '@/data/mockData';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash, 
  Check, 
  X, 
  Filter,
  UserCog
} from 'lucide-react';

const PatientsManagement = () => {
  const navigate = useNavigate();
  const [patientsList, setPatientsList] = useState<Patient[]>(patients as Patient[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient' as const,
    medicalHistory: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patientsList.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (!selectedPatient) return;
    
    setFormData({
      name: selectedPatient.name,
      email: selectedPatient.email,
      role: 'patient',
      medicalHistory: selectedPatient.medicalHistory ? 
        selectedPatient.medicalHistory.map(h => h.condition).join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setFormData({
      name: '',
      email: '',
      role: 'patient',
      medicalHistory: ''
    });
    setShowAddForm(true);
  };

  const handleDeletePatient = (patientId: string) => {
    // Confirmation dialog
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatientsList(prevPatients => prevPatients.filter(p => p.id !== patientId));
      setSelectedPatient(null);
      toast({
        title: "Patient Deleted",
        description: "The patient record has been successfully removed",
      });
    }
  };

  const handleSavePatient = () => {
    if (showAddForm) {
      // Add new patient
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'patient',
        medicalHistory: formData.medicalHistory ? [{
          id: `med-${Date.now()}`,
          patientId: `patient-${Date.now()}`,
          condition: formData.medicalHistory,
          diagnosisDate: new Date().toISOString().split('T')[0],
          treatment: 'Not specified',
          notes: ''
        }] : []
      };
      
      setPatientsList(prev => [...prev, newPatient]);
      setShowAddForm(false);
      toast({
        title: "Patient Added",
        description: "New patient record has been created successfully",
      });
    } else if (isEditing && selectedPatient) {
      // Update existing patient
      const updatedPatients = patientsList.map(p => {
        if (p.id === selectedPatient.id) {
          const medHistory = p.medicalHistory || [];
          if (formData.medicalHistory && formData.medicalHistory !== medHistory.map(h => h.condition).join(', ')) {
            medHistory.push({
              id: `med-${Date.now()}`,
              patientId: p.id,
              condition: formData.medicalHistory,
              diagnosisDate: new Date().toISOString().split('T')[0],
              treatment: 'Updated',
              notes: ''
            });
          }
          
          return {
            ...p,
            name: formData.name,
            email: formData.email,
            medicalHistory: medHistory
          };
        }
        return p;
      });
      
      setPatientsList(updatedPatients);
      setSelectedPatient(updatedPatients.find(p => p.id === selectedPatient.id) as Patient);
      setIsEditing(false);
      toast({
        title: "Patient Updated",
        description: "Patient record has been updated successfully",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patient Management</h1>
            <p className="text-muted-foreground">Add, update and delete patient records</p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <UserPlus size={16} />
            Add New Patient
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient List */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                {filteredPatients.length} patients found
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={patient.image} />
                          <AvatarFallback className="bg-healwise-blue text-white">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium leading-none">{patient.name}</p>
                          <p className={`text-sm ${
                            selectedPatient?.id === patient.id
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}>
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No patients found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {showAddForm 
                  ? "Add New Patient" 
                  : isEditing && selectedPatient 
                  ? `Edit: ${selectedPatient.name}` 
                  : selectedPatient 
                  ? "Patient Details" 
                  : "Select a Patient"}
              </CardTitle>
              <CardDescription>
                {showAddForm 
                  ? "Create a new patient record" 
                  : isEditing 
                  ? "Update patient information" 
                  : selectedPatient 
                  ? "View and manage patient information" 
                  : "Select a patient from the list to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add or Edit Form */}
              {(isEditing || showAddForm) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter patient email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical Conditions</Label>
                    <Textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      placeholder="Enter medical conditions separated by commas"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSavePatient}>
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {/* Patient Details View */}
              {!isEditing && !showAddForm && selectedPatient && (
                <>
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedPatient.image} />
                        <AvatarFallback className="bg-healwise-blue text-white text-xl">
                          {getInitials(selectedPatient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
                        <p className="text-muted-foreground">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleEditClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeletePatient(selectedPatient.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                      <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Patient ID</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-mono">{selectedPatient.id}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Badge className="bg-green-500">Active</Badge>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedPatient.appointments && selectedPatient.appointments.length > 0 ? (
                                selectedPatient.appointments.slice(0, 3).map((apt, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-healwise-blue"></div>
                                    <span>Appointment on {new Date(apt.dateTime).toLocaleDateString()}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No recent activity</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="medical-history">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Medical History</CardTitle>
                          <CardDescription>
                            Patient's medical conditions and diagnoses
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                            <div className="space-y-4">
                              {selectedPatient.medicalHistory.map((record, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">{record.condition}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Diagnosed: {record.diagnosisDate}
                                      </p>
                                    </div>
                                    <Badge variant="outline">{record.treatment}</Badge>
                                  </div>
                                  {record.notes && (
                                    <p className="text-sm mt-2 border-t pt-2">{record.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No medical history records</p>
                          )}
                          <Button className="mt-4" variant="outline">
                            <UserCog className="mr-2 h-4 w-4" />
                            Add Medical Record
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="appointments">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Appointments</CardTitle>
                          <CardDescription>
                            Patient's scheduled and past appointments
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {selectedPatient.appointments && selectedPatient.appointments.length > 0 ? (
                            <div className="space-y-4">
                              {selectedPatient.appointments.map((apt, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">
                                        Appointment on {new Date(apt.dateTime).toLocaleDateString()}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Time: {new Date(apt.dateTime).toLocaleTimeString()}
                                      </p>
                                    </div>
                                    <Badge
                                      className={apt.status === 'completed' 
                                        ? 'bg-green-500' 
                                        : apt.status === 'cancelled' 
                                        ? 'bg-red-500' 
                                        : 'bg-blue-500'}
                                    >
                                      {apt.status}
                                    </Badge>
                                  </div>
                                  {apt.notes && (
                                    <p className="text-sm mt-2 border-t pt-2">{apt.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No appointments</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              {/* Empty State */}
              {!isEditing && !showAddForm && !selectedPatient && (
                <div className="text-center py-12">
                  <UserCog size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a patient from the list or add a new patient
                  </p>
                  <Button onClick={handleAddNew}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientsManagement;
