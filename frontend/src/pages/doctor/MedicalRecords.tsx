import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";
import { Patient } from "@/types";
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
  FileSymlink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface BackendMedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  date: string;
  status: string;
}

const MedicalRecords = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get("patientId");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState<{ id: string; name: string } | null>(null);
  const [allFetchedReports, setAllFetchedReports] = useState<BackendMedicalReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<BackendMedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      // Placeholder until data is fetched
      setSelectedPatientInfo({ id: patientId, name: "Loading..." });
    } else {
      setSelectedPatientInfo(null);
    }
  }, [patientId]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setError("Authentication token not found.");
        setIsLoading(false); // Ensure loading stops if no token
        return;
      }
      setIsLoading(true);
      setError(null);
      setAllFetchedReports([]); // Clear previous results

      const params = new URLSearchParams();
      if (patientId) {
        params.append('patientId', patientId);
      }

      try {
        const response = await axios.get(`/api/doctor/reports`, {
          headers: { Authorization: `Bearer ${token}` },
          params: params
        });
        setAllFetchedReports(response.data);

         if (patientId && response.data.length > 0) {
            // Use the name from the first report for the selected patient view
            setSelectedPatientInfo({ id: patientId, name: response.data[0].patientName || "Unknown Patient" });
          } else if (patientId && response.data.length === 0) {
            // If a patient ID is specified but no reports found, still show the ID maybe? Or fetch patient name separately.
            // For now, let's assume "Unknown" if no reports are found for a specific ID.
             setSelectedPatientInfo({ id: patientId, name: "Patient (No Records)" }); // Or fetch patient name via another endpoint if needed
          }

      } catch (err: any) {
        console.error("Error fetching reports:", err);
        setError(err.response?.data?.message || "Failed to fetch medical records.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if token is available
    if (token) {
      fetchReports();
    } else {
       setError("Authentication required."); // Set error if no token on initial load/check
       setIsLoading(false);
    }

  }, [patientId, token]); // Refetch when patientId or token changes

  useEffect(() => {
    let reportsToFilter = allFetchedReports;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      reportsToFilter = reportsToFilter.filter(report =>
        (report.type && report.type.toLowerCase().includes(lowerSearchTerm)) ||
        (report.patientName && report.patientName.toLowerCase().includes(lowerSearchTerm))
      );
    }

    setFilteredReports(reportsToFilter);
  }, [searchTerm, allFetchedReports]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
        console.warn("Invalid date format:", dateString);
        return "Invalid Date";
    }
  };

  const getTimeSince = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
        console.warn("Invalid date format for distance:", dateString);
        return "";
    }
  };

  const handleCreateReport = () => {
    navigate(`/medical-records/new${selectedPatientInfo ? `?patientId=${selectedPatientInfo.id}` : ''}`);
  };

  const handleDownloadReport = (reportId: string) => {
      if (!token) {
          toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
          return;
      }
      const downloadUrl = `/api/doctor/reports/${reportId}/download`;

      toast({ title: "Initiating Download", description: "Please wait...", duration: 2000 });

      fetch(downloadUrl, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      })
      .then(async (res) => {
          if (!res.ok) {
              const errorData = await res.json().catch(() => ({ message: 'Download failed with status ' + res.status }));
              throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          const disposition = res.headers.get('content-disposition');
          let filename = 'report.pdf';
          if (disposition && disposition.indexOf('attachment') !== -1) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1]) {
                  filename = matches[1].replace(/['"]/g, '');
              }
          }
          return res.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          toast({
              title: "Download Started",
              description: `Report ${filename} should be downloading.`,
          });
      })
      .catch(error => {
          console.error('Download error:', error);
          toast({
              title: "Download Failed",
              description: error.message || "Could not download the report.",
              variant: "destructive",
          });
      });
  };

  const handleViewReport = (reportId: string) => {
    if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
        return;
    }

    const viewUrl = `/api/doctor/reports/${reportId}/view`;

    // Call toast and destructure the returned id and update function
    const { id: loadingToastId, update: updateLoadingToast } = toast({
        title: "Loading Report",
        description: "Please wait...",
        variant: "default", // Use a neutral variant initially
    });

    fetch(viewUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to load report.' }));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/pdf")) {
            throw new Error("Received file is not a PDF.");
        }
        return res.blob();
    })
    .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');

        // Use the captured update function to modify the existing toast
        updateLoadingToast({
            id: loadingToastId, // Pass the ID to the update function
            title: "Report Loaded",
            description: "The report should be open in a new tab.",
            variant: "default", // Or your success variant
        });
    })
    .catch(error => {
        console.error('View report error:', error);

        // Use the captured update function to modify the existing toast
        updateLoadingToast({
            id: loadingToastId, // Pass the ID to the update function
            title: "Loading Failed",
            description: error.message || "Could not load the report.",
            variant: "destructive",
        });
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading records...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 border rounded-md border-destructive bg-destructive/10 text-destructive">
           <AlertCircle className="h-10 w-10 mx-auto" />
           <h3 className="mt-4 text-lg font-medium">Error Fetching Records</h3>
           <p className="mt-2 text-sm">{error}</p>
        </div>
      );
    }

    const noRecordsCondition = filteredReports.length === 0 && !isLoading;

    if (noRecordsCondition && !searchTerm && (selectedPatientInfo || !patientId)) {
       // Show specific message if a patient is selected (or all view) but no records exist initially
        return (
          <div className="text-center py-8 border rounded-md">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Records Found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {selectedPatientInfo
                ? "There are no medical records for this patient yet."
                : "There are no medical records available."}
            </p>
            <Button className="mt-4" onClick={handleCreateReport}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Report
            </Button>
          </div>
       )
    }

    if (noRecordsCondition && searchTerm) {
        // Show message if filtering results in no records
         return (
            <div className="text-center py-8 border rounded-md">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Matching Records</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    No records found matching "{searchTerm}". Try different search terms.
                </p>
                 {selectedPatientInfo && (
                    <Button className="mt-4" onClick={handleCreateReport}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Report for Patient
                    </Button>
                 )}
            </div>
        );
    }

     const isPatientView = !!selectedPatientInfo;

    return (
        <Table>
          <TableHeader>
            <TableRow>
              {!isPatientView && <TableHead>Patient</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              {/* Results column is removed for simplicity, view PDF instead */}
              {/* {isPatientView && <TableHead>Results</TableHead>} */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                 {!isPatientView && (
                    <TableCell className="font-medium">
                        <Button
                            variant="link"
                            className="p-0 h-auto font-medium"
                            onClick={() => navigate(`/medical-records?patientId=${report.patientId}`)}
                        >
                            {report.patientName || "Unknown Patient"}
                        </Button>
                    </TableCell>
                 )}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {report.type?.toLowerCase().includes("image") || report.type?.toLowerCase().includes("x-ray") ? (
                      <FileImage className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    {report.type || 'N/A'}
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
                  <Badge variant={report.status === 'completed' ? "secondary" : "outline"}>
                     {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}
                  </Badge>
                </TableCell>
                {/* {isPatientView && (
                  <TableCell className="max-w-[250px] truncate">
                    View PDF for details
                  </TableCell>
                )} */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Report"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Report"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <FileSymlink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {selectedPatientInfo ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/medical-records')}
                  aria-label="Back to all records"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Medical Records</h1>
                  <p className="text-muted-foreground">
                    Viewing records for patient: <span className="font-medium">{selectedPatientInfo.name}</span>
                  </p>
                </div>
              </div>
              <Button onClick={handleCreateReport} disabled={isLoading}>
                <FilePlus className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Patient Records</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search records by type..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading || !!error}
                    />
                  </div>
                </div>
                <CardDescription>
                  {isLoading ? 'Loading...' : `${filteredReports.length} records found ${searchTerm ? `matching "${searchTerm}"` : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-2xl font-bold">Medical Records</h1>
              <Button onClick={handleCreateReport} disabled={isLoading}>
                <FilePlus className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>All Patient Records</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by type or patient..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading || !!error}
                    />
                  </div>
                </div>
                <CardDescription>
                  {isLoading ? 'Loading...' : `Displaying ${filteredReports.length} total records ${searchTerm ? `matching "${searchTerm}"` : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {renderContent()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;