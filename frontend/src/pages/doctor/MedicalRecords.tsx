
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  FileText,
  FilePlus,
  ArrowLeft,
  PlusCircle,
  FileImage,
  Download,
  Loader2,
  Eye
} from "lucide-react";
import {
  doctorReportsService,
  DoctorReport,
  ReportsPagination,
  ReportsSearchParams
} from "../../services/doctorReportsService";

const MedicalRecords = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get("patientId");

  // State for real-time data
  const [reports, setReports] = useState<DoctorReport[]>([]);
  const [pagination, setPagination] = useState<ReportsPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{_id: string, name: string} | null>(null);

  // Fetch reports from API
  useEffect(() => {
    if (user && token) {
      fetchReports();
    }
  }, [user, token, patientId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && token) {
        fetchReports();
      }
    }, 500); // 500ms delay for search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const searchParams: ReportsSearchParams = {
        page: 1,
        limit: 50 // Get more reports for better UX
      };

      if (patientId) {
        searchParams.patientId = patientId;
      }

      if (searchTerm.trim()) {
        searchParams.search = searchTerm.trim();
      }

      const { reports: fetchedReports, pagination: fetchedPagination } =
        await doctorReportsService.getDoctorReports(token!, searchParams);

      setReports(fetchedReports);
      setPagination(fetchedPagination);

      // Set selected patient if viewing specific patient reports
      if (patientId && fetchedReports.length > 0) {
        const firstReport = fetchedReports[0];
        setSelectedPatient({
          _id: firstReport.patient._id,
          name: firstReport.patient.name
        });
      } else {
        setSelectedPatient(null);
      }

    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load medical reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return doctorReportsService.formatReportDate(dateString);
  };

  // Get time since for reports
  const getTimeSince = (dateString: string) => {
    return doctorReportsService.getTimeSince(dateString);
  };

  const handleCreateReport = () => {
    navigate(`/medical-records/new${selectedPatient ? `?patientId=${selectedPatient._id}` : ''}`);
  };

  const handleDownloadReport = async (report: DoctorReport) => {
    try {
      await doctorReportsService.downloadReportWithFilename(token!, report._id, report);
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      await doctorReportsService.viewReport(token!, reportId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open report",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
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
                      placeholder="Search by patient name, report type..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  {loading ? 'Loading...' : `${reports.length} records found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading reports...</span>
                  </div>
                ) : reports.length === 0 ? (
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
                      {reports.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {report.type.toLowerCase().includes("image") ||
                               report.type.toLowerCase().includes("x-ray") ||
                               report.type.toLowerCase().includes("scan") ? (
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
                            <Badge
                              variant={doctorReportsService.getStatusVariant(report.status)}
                              className={doctorReportsService.getStatusColor(report.status)}
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            Patient: {report.patient.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewReport(report._id)}
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadReport(report)}
                                title="Download Report"
                              >
                                <Download className="h-4 w-4" />
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
                      placeholder="Search by patient name, report type..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  {loading ? 'Loading...' : `View and manage all patient medical records (${reports.length} total)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading reports...</span>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Reports Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      {searchTerm ? 'No reports match your search criteria.' : 'No medical reports have been created yet.'}
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
                        <TableHead>Patient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">
                            <Button
                              variant="link"
                              className="p-0 h-auto font-medium"
                              onClick={() => navigate(`/medical-records?patientId=${report.patient._id}`)}
                            >
                              {report.patient.name}
                            </Button>
                            <div className="text-xs text-muted-foreground">
                              {report.patient.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {report.type.toLowerCase().includes("image") ||
                               report.type.toLowerCase().includes("x-ray") ||
                               report.type.toLowerCase().includes("scan") ? (
                                <FileImage className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              {report.type}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.date)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={doctorReportsService.getStatusVariant(report.status)}
                              className={doctorReportsService.getStatusColor(report.status)}
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewReport(report._id)}
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadReport(report)}
                                title="Download Report"
                              >
                                <Download className="h-4 w-4" />
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
