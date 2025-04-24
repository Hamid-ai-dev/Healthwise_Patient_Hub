
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { patients } from "@/data/mockData";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Brain,
  FileImage,
  ArrowLeft,
  Plus,
  Check,
  X,
  Loader2,
  ChevronRight,
  Pill
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

const AnalyzeImages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  
  const [selectedPatient, setSelectedPatient] = useState(patientId || "");
  const [selectedImageType, setSelectedImageType] = useState("x-ray");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState("");
  const [suggestedPrescriptions, setSuggestedPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editedPrescription, setEditedPrescription] = useState<Prescription | null>(null);
  const [isPrescribing, setIsPrescribing] = useState(false);

  // Demo image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisComplete(false);
        setAnalysisResults("");
        setSuggestedPrescriptions([]);
        setSelectedPrescription(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate AI analysis
  const analyzeImage = () => {
    if (!uploadedImage || !selectedPatient) {
      toast({
        title: "Missing information",
        description: "Please select a patient and upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      // Mock analysis results based on image type
      let analysisText = "";
      let prescriptions: Prescription[] = [];
      
      if (selectedImageType === "x-ray") {
        analysisText = "The X-ray shows mild carpal tunnel syndrome with some compression of the median nerve. There appears to be minor inflammation in the surrounding tissues, but no fractures or dislocations are visible.";
        
        prescriptions = [
          {
            id: "1",
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "Twice daily",
            duration: "7 days",
            notes: "Take with food to reduce stomach irritation"
          },
          {
            id: "2",
            name: "Naproxen",
            dosage: "500mg",
            frequency: "Once daily",
            duration: "5 days",
            notes: "May cause drowsiness. Do not drive or operate machinery."
          }
        ];
      } else if (selectedImageType === "mri") {
        analysisText = "MRI scan reveals minor disc herniation at L4-L5 level with slight nerve impingement. There is moderate degeneration of the disc but no spinal stenosis. Surrounding soft tissues show mild inflammation.";
        
        prescriptions = [
          {
            id: "1",
            name: "Cyclobenzaprine",
            dosage: "10mg",
            frequency: "Once daily at bedtime",
            duration: "10 days",
            notes: "May cause drowsiness"
          },
          {
            id: "2",
            name: "Diclofenac",
            dosage: "75mg",
            frequency: "Twice daily",
            duration: "14 days",
            notes: "Take with food. Avoid alcohol consumption."
          },
          {
            id: "3",
            name: "Gabapentin",
            dosage: "300mg",
            frequency: "Three times daily",
            duration: "14 days",
            notes: "Gradually increase dose as tolerated"
          }
        ];
      } else {
        analysisText = "CT scan shows no acute intracranial abnormality. Ventricles and sulci are normal in size and configuration. No evidence of mass effect, midline shift, or intracranial hemorrhage.";
        
        prescriptions = [
          {
            id: "1",
            name: "Acetaminophen",
            dosage: "500mg",
            frequency: "Every 6 hours as needed",
            duration: "3 days",
            notes: "Do not exceed 4000mg in 24 hours"
          },
          {
            id: "2",
            name: "Sumatriptan",
            dosage: "50mg",
            frequency: "As needed for migraine",
            duration: "PRN (as needed)",
            notes: "Not to exceed 200mg in 24 hours. Do not take with MAOIs."
          }
        ];
      }
      
      setAnalysisResults(analysisText);
      setSuggestedPrescriptions(prescriptions);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis complete",
        description: "AI analysis has been completed successfully",
      });
    }, 3000);
  };

  const selectPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditedPrescription({...prescription});
  };

  const updatePrescription = () => {
    if (!editedPrescription) return;
    
    setSelectedPrescription(editedPrescription);
    setIsPrescribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Prescription updated",
        description: "The prescription has been updated successfully",
      });
      setIsPrescribing(false);
    }, 1500);
  };

  const handlePrescriptionChange = (field: keyof Prescription, value: string) => {
    if (!editedPrescription) return;
    setEditedPrescription({
      ...editedPrescription,
      [field]: value
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Analyze Medical Images</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Image Upload
              </CardTitle>
              <CardDescription>
                Upload patient images for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={selectedPatient} 
                  onValueChange={setSelectedPatient}
                  disabled={!!patientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageType">Image Type</Label>
                <Select 
                  value={selectedImageType} 
                  onValueChange={setSelectedImageType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select image type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x-ray">X-Ray</SelectItem>
                    <SelectItem value="mri">MRI</SelectItem>
                    <SelectItem value="ct">CT Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>

              {uploadedImage && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded medical image" 
                    className="w-full h-auto"
                  />
                  <div className="p-2 bg-muted flex justify-end">
                    <Button 
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered analysis and prescription suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisComplete ? (
                <div className="text-center py-10">
                  <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and analyze a medical image to see results and prescription suggestions
                  </p>
                </div>
              ) : (
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">AI Analysis</h3>
                      <p className="text-muted-foreground text-sm">
                        Image processed and analyzed by AI
                      </p>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        {analysisResults}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-4 py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Suggested Prescriptions</h3>
                      <p className="text-muted-foreground text-sm">
                        Select a prescription to review and modify
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedPrescriptions.map((prescription) => (
                          <Card key={prescription.id} className={`overflow-hidden cursor-pointer transition-colors ${selectedPrescription?.id === prescription.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'}`}>
                            <div 
                              className="p-4"
                              onClick={() => selectPrescription(prescription)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-md">{prescription.name}</h4>
                                <Badge variant="outline">{prescription.dosage}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
                                <p><span className="font-medium">Duration:</span> {prescription.duration}</p>
                                {prescription.notes && (
                                  <p className="text-xs italic mt-2">{prescription.notes}</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {selectedPrescription && (
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Pill className="h-5 w-5 mr-2" />
                              Edit Prescription
                            </CardTitle>
                            <CardDescription>
                              Review and modify the selected prescription
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="med-name">Medication</Label>
                                  <Input 
                                    id="med-name" 
                                    value={editedPrescription?.name || ''} 
                                    onChange={(e) => handlePrescriptionChange('name', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="med-dosage">Dosage</Label>
                                  <Input 
                                    id="med-dosage" 
                                    value={editedPrescription?.dosage || ''} 
                                    onChange={(e) => handlePrescriptionChange('dosage', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="med-frequency">Frequency</Label>
                                  <Input 
                                    id="med-frequency" 
                                    value={editedPrescription?.frequency || ''} 
                                    onChange={(e) => handlePrescriptionChange('frequency', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="med-duration">Duration</Label>
                                  <Input 
                                    id="med-duration" 
                                    value={editedPrescription?.duration || ''} 
                                    onChange={(e) => handlePrescriptionChange('duration', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="med-notes">Notes</Label>
                                <Textarea 
                                  id="med-notes" 
                                  value={editedPrescription?.notes || ''} 
                                  onChange={(e) => handlePrescriptionChange('notes', e.target.value)}
                                  placeholder="Additional instructions or warnings"
                                />
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button 
                              variant="outline"
                              onClick={() => setSelectedPrescription(null)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              onClick={updatePrescription}
                              disabled={isPrescribing}
                            >
                              {isPrescribing ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Updating...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Check className="h-4 w-4" />
                                  Update Prescription
                                </span>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            {analysisComplete && (
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ml-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Full Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Medical Report</DialogTitle>
                      <DialogDescription>
                        Would you like to create a complete medical report with these findings?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>This will create a new medical report with:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>The uploaded diagnostic image</li>
                        <li>AI analysis results</li>
                        <li>The prescription you selected</li>
                      </ul>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>Cancel</Button>
                      <Button onClick={() => {
                        toast({
                          title: "Report created",
                          description: "Medical report has been created successfully",
                        });
                        navigate(`/medical-records?patientId=${selectedPatient}`);
                      }}>
                        <FileImage className="h-4 w-4 mr-2" />
                        Create Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyzeImages;
