
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MedicalReport, Patient } from "@/types";
import { patients, medicalReports } from "@/data/mockData";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Calendar, 
  FileText, 
  FilePlus, 
  ArrowLeft,
  PlusCircle,
  FileImage,
  Download,
  FileSymlink 
} from "lucide-react";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";

const MedicalRecords = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get("patientId");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filteredReports, setFilteredReports] = useState<MedicalReport[]>([]);
  
  // Find selected patient from the patientId in URL or set to null
  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      setSelectedPatient(patient || null);
    } else {
      setSelectedPatient(null);
    }
  }, [patientId]);
  
  // Filter medical reports based on selected patient and search term
  useEffect(() => {
    let reports = medicalReports;
    
    if (selectedPatient) {
      reports = reports.filter(report => report.patientId === selectedPatient.id);
    }
    
    if (searchTerm) {
      reports = reports.filter(report => 
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.results.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredReports(reports);
  }, [selectedPatient, searchTerm]);

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

  // Get time since for reports
  const getTimeSince = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const handleCreateReport = () => {
    navigate(`/medical-records/new${selectedPatient ? `?patientId=${selectedPatient.id}` : ''}`);
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Report download started",
      description: "Your report will be downloaded shortly",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {selectedPatient ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/medical-records')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Medical Records</h1>
                  <p className="text-muted-foreground">
                    Viewing records for patient: <span className="font-medium">{selectedPatient.name}</span>
                  </p>
                </div>
              </div>
              <Button onClick={handleCreateReport}>
                <FilePlus className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Patient Records</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  {filteredReports.length} records found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Records Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      There are no medical records for this patient yet. Create a new report to add one.
                    </p>
                    <Button className="mt-4" onClick={handleCreateReport}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Report
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Results</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {report.type.includes("Image") || report.type.includes("X-ray") ? (
                                <FileImage className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              {report.type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {formatDate(report.date)}
                              <div className="text-xs text-muted-foreground">
                                {getTimeSince(report.date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            {report.results}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadReport(report.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/medical-records/${report.id}`)}
                              >
                                <FileSymlink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Medical Records</h1>
              <Button onClick={handleCreateReport}>
                <FilePlus className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>All Patient Records</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  View and manage all patient medical records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const patient = patients.find(p => p.id === report.patientId);
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto font-medium"
                              onClick={() => navigate(`/medical-records?patientId=${report.patientId}`)}
                            >
                              {patient?.name || "Unknown Patient"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {report.type.includes("Image") || report.type.includes("X-ray") ? (
                                <FileImage className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              {report.type}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.date)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadReport(report.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/medical-records/${report.id}`)}
                              >
                                <FileSymlink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
