
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Patient, Appointment, MedicalReport, PatientQuery } from "@/types";
import { patients, appointments, medicalReports, doctors } from "@/data/mockData";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  UserRound, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  PlusCircle,
  FileText,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Activity
} from "lucide-react";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Mock patient queries data
const patientQueries: PatientQuery[] = [
  {
    id: "q1",
    patientId: "1",
    doctorId: "2",
    message: "I've been experiencing headaches after taking the new medication. Should I be concerned?",
    status: "pending",
    createdAt: "2023-06-18T09:30:00"
  },
  {
    id: "q2",
    patientId: "1",
    doctorId: "2",
    message: "When should I schedule my follow-up appointment?",
    response: "Please schedule your follow-up in 2 weeks. You can use the appointments section to book a slot.",
    status: "answered",
    createdAt: "2023-06-15T10:20:00",
    updatedAt: "2023-06-15T14:30:00"
  }
];

// Enhanced mock data for patients
const enhancedPatients: Patient[] = patients.map(patient => ({
  ...patient,
  age: Math.floor(Math.random() * 50) + 20,
  gender: Math.random() > 0.5 ? "Male" : "Female",
  phone: "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
  address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State`,
  notes: patient.id === "1" ? 
    "Patient has a history of hypertension. Currently on medication. Last checkup showed improved vital signs." :
    "Regular checkups show good health. No significant medical history.",
  queries: patientQueries.filter(query => query.patientId === patient.id)
}));

const PatientManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [newNote, setNewNote] = useState("");
  const [queryResponse, setQueryResponse] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<PatientQuery | null>(null);

  // Filter doctor's patients
  const doctorPatients = enhancedPatients.filter(patient => {
    const doctorId = user?.id || "";
    const isPatientOfDoctor = doctors.find(doc => 
      doc.id === doctorId && doc.patients?.includes(patient.id)
    );
    
    return isPatientOfDoctor && patient.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter patient's appointments, reports, and queries
  const patientAppointments = appointments.filter(
    app => selectedPatient && app.patientId === selectedPatient.id
  );

  const patientReports = medicalReports.filter(
    report => selectedPatient && report.patientId === selectedPatient.id
  );

  const patientQueries = selectedPatient?.queries || [];

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab("profile");
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedPatient) return;
    
    // In a real app, you would send this to an API
    toast({
      title: "Note added",
      description: "Patient note has been saved successfully",
    });
    
    // Update the patient's notes (in a real app, this would happen after API success)
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        notes: selectedPatient.notes 
          ? `${selectedPatient.notes}\n\n${new Date().toLocaleDateString()}: ${newNote}`
          : `${new Date().toLocaleDateString()}: ${newNote}`
      };
      setSelectedPatient(updatedPatient);
      setNewNote("");
    }
  };

  // Handle responding to a query
  const handleQueryResponse = () => {
    if (!queryResponse.trim() || !selectedQuery) return;
    
    // In a real app, you would send this to an API
    toast({
      title: "Response sent",
      description: "Your response has been sent to the patient",
    });
    
    // Update the query status (in a real app, this would happen after API success)
    if (selectedPatient && selectedPatient.queries) {
      const updatedQueries = selectedPatient.queries.map(q => 
        q.id === selectedQuery.id 
          ? {...q, response: queryResponse, status: 'answered' as const, updatedAt: new Date().toISOString()} 
          : q
      );
      
      setSelectedPatient({
        ...selectedPatient,
        queries: updatedQueries
      });
      
      setQueryResponse("");
      setSelectedQuery(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format time since for queries
  const getTimeSince = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Patient List */}
          <div className="lg:w-1/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>My Patients</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/patients/add')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search patients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[calc(100vh-300px)]">
                {doctorPatients.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No patients found</p>
                ) : (
                  <ul className="space-y-2">
                    {doctorPatients.map((patient) => (
                      <li key={patient.id}>
                        <button
                          className={`w-full text-left p-3 rounded-md flex items-center space-x-3 transition-colors ${
                            selectedPatient?.id === patient.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {patient.image ? (
                              <img src={patient.image} alt="" className="h-10 w-10 rounded-full" />
                            ) : (
                              <UserRound className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{patient.name}</p>
                            <p className={`text-sm truncate ${
                              selectedPatient?.id === patient.id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}>
                              {patient.age} years • {patient.gender}
                            </p>
                          </div>
                          {patient.queries?.some(q => q.status === "pending") && (
                            <Badge variant="destructive" className="flex-shrink-0">
                              {patient.queries.filter(q => q.status === "pending").length} new
                            </Badge>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:w-2/3">
            {selectedPatient ? (
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                        {selectedPatient.image ? (
                          <img src={selectedPatient.image} alt="" className="h-14 w-14 rounded-full" />
                        ) : (
                          <UserRound className="h-7 w-7" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            Patient ID: {selectedPatient.id}
                          </Badge>
                          {selectedPatient.age} years • {selectedPatient.gender}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/messages?patientId=${selectedPatient.id}`)}>
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        Message
                      </Button>
                      <Button size="sm" onClick={() => navigate(`/appointments/new?patientId=${selectedPatient.id}`)}>
                        <Calendar className="h-4 w-4 mr-1.5" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start px-6">
                    <TabsTrigger value="profile" className="flex items-center">
                      <UserRound className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="medical" className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Medical
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointments
                    </TabsTrigger>
                    <TabsTrigger value="queries" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Queries
                      {patientQueries.some(q => q.status === "pending") && (
                        <Badge variant="destructive" className="ml-2">
                          {patientQueries.filter(q => q.status === "pending").length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{selectedPatient.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{selectedPatient.phone}</span>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <span>{selectedPatient.address}</span>
                            </div>
                          </div>
                        </div>

                        {selectedPatient.healthMetrics && (
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground mb-2">Health Metrics</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-muted/40 p-3 rounded-md">
                                <div className="text-sm text-muted-foreground">Height</div>
                                <div className="font-medium">{selectedPatient.healthMetrics.height} cm</div>
                              </div>
                              <div className="bg-muted/40 p-3 rounded-md">
                                <div className="text-sm text-muted-foreground">Weight</div>
                                <div className="font-medium">{selectedPatient.healthMetrics.weight} kg</div>
                              </div>
                              <div className="bg-muted/40 p-3 rounded-md">
                                <div className="text-sm text-muted-foreground">Blood Pressure</div>
                                <div className="font-medium">{selectedPatient.healthMetrics.bloodPressure}</div>
                              </div>
                              <div className="bg-muted/40 p-3 rounded-md">
                                <div className="text-sm text-muted-foreground">Heart Rate</div>
                                <div className="font-medium">{selectedPatient.healthMetrics.heartRate} bpm</div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              Last updated: {formatDate(selectedPatient.healthMetrics.lastUpdated)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
                        <div className="bg-muted/40 p-3 rounded-md mb-3 min-h-[120px] whitespace-pre-line">
                          {selectedPatient.notes || "No notes available for this patient."}
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add a new note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <Button 
                            onClick={handleAddNote} 
                            disabled={!newNote.trim()}
                            className="w-full"
                          >
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Medical Tab */}
                  <TabsContent value="medical" className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Medical Records */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Medical Reports</h3>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/medical-records/new?patientId=${selectedPatient.id}`)}>
                            <FileText className="h-4 w-4 mr-1.5" />
                            Add Report
                          </Button>
                        </div>
                        
                        {patientReports.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8 border rounded-md">
                            No medical reports available
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {patientReports.map((report) => (
                              <Card key={report.id}>
                                <CardHeader className="py-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base">{report.type}</CardTitle>
                                      <CardDescription>{formatDate(report.date)}</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-0">
                                  <p className="text-sm text-muted-foreground">{report.results}</p>
                                </CardContent>
                                {report.aiAnalysis && (
                                  <CardFooter className="pt-3 pb-4 border-t mt-3">
                                    <div>
                                      <div className="text-xs font-medium text-muted-foreground mb-1">AI Analysis</div>
                                      <p className="text-sm">{report.aiAnalysis}</p>
                                    </div>
                                  </CardFooter>
                                )}
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="px-6 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Appointments</h3>
                      <Button size="sm" onClick={() => navigate(`/appointments/new?patientId=${selectedPatient.id}`)}>
                        <PlusCircle className="h-4 w-4 mr-1.5" />
                        Schedule New
                      </Button>
                    </div>
                    
                    {patientAppointments.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8 border rounded-md">
                        No appointments scheduled
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patientAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-medium">
                                {new Date(appointment.dateTime).toLocaleString()}
                              </TableCell>
                              <TableCell>{appointment.type || "General Checkup"}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  appointment.status === "scheduled" ? "outline" :
                                  appointment.status === "completed" ? "secondary" : "destructive"
                                }>
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {appointment.notes || "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>

                  {/* Queries Tab */}
                  <TabsContent value="queries" className="px-6 pb-6">
                    {patientQueries.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8 border rounded-md">
                        No patient queries
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientQueries.map((query) => (
                          <Card key={query.id} className={query.status === "pending" ? "border-destructive" : ""}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={
                                      query.status === "pending" ? "destructive" : 
                                      query.status === "answered" ? "secondary" : "outline"
                                    }>
                                      {query.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {getTimeSince(query.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4">{query.message}</p>
                              {query.response && (
                                <div className="bg-muted p-3 rounded-md mt-3">
                                  <div className="text-sm font-medium mb-1">Your response:</div>
                                  <p className="text-sm">{query.response}</p>
                                  {query.updatedAt && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {getTimeSince(query.updatedAt)}
                                    </p>
                                  )}
                                </div>
                              )}
                              {query.status === "pending" && (
                                <div className="mt-3">
                                  {selectedQuery?.id === query.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        placeholder="Type your response..."
                                        value={queryResponse}
                                        onChange={(e) => setQueryResponse(e.target.value)}
                                        className="min-h-[100px]"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                                          Cancel
                                        </Button>
                                        <Button onClick={handleQueryResponse} disabled={!queryResponse.trim()}>
                                          Send Response
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      className="w-full"
                                      onClick={() => {
                                        setSelectedQuery(query);
                                        setQueryResponse("");
                                      }}
                                    >
                                      Respond to Query
                                    </Button>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg p-8">
                <div className="text-center">
                  <UserRound className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Patient Selected</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Select a patient from the list to view their details, medical history, appointments and queries.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientManagement;
