
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  FileImage,
  Upload,
  AlertCircle,
  Info,
  ImagePlus,
  MonitorX,
  Scan,
  Microscope,
  FileCheck,
  UploadCloud
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const ImageAnalysis = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset analysis states
      setIsAnalyzing(false);
      setAnalysisComplete(false);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Medical Image Analysis</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered analysis of medical images for faster and more accurate diagnoses
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            This tool is designed to assist healthcare professionals and should not replace professional medical diagnosis.
            All analyses should be verified by qualified medical personnel.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MonitorX className="h-5 w-5 text-healwise-blue" />
                X-Ray Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI can detect and analyze abnormalities in X-ray images, including fractures, lesions, and other conditions.
              </p>
              <div className="flex justify-between items-center">
                <Badge>99.7% Accuracy</Badge>
                <Button size="sm" variant="outline" className="px-2">
                  <FileImage className="h-4 w-4 mr-1" />
                  <span>Learn More</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scan className="h-5 w-5 text-healwise-green" />
                MRI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed analysis of MRI scans to detect abnormalities, tumors, tissue damage, and other conditions.
              </p>
              <div className="flex justify-between items-center">
                <Badge>98.5% Accuracy</Badge>
                <Button size="sm" variant="outline" className="px-2">
                  <FileImage className="h-4 w-4 mr-1" />
                  <span>Learn More</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Microscope className="h-5 w-5 text-healwise-orange" />
                Pathology Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analysis of histopathology images to detect cellular abnormalities, cancer cells, and other microscopic conditions.
              </p>
              <div className="flex justify-between items-center">
                <Badge>97.8% Accuracy</Badge>
                <Button size="sm" variant="outline" className="px-2">
                  <FileImage className="h-4 w-4 mr-1" />
                  <span>Learn More</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Medical Image</CardTitle>
            <CardDescription>
              Upload your medical image for AI analysis and get results in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="history">Analysis History</TabsTrigger>
                <TabsTrigger value="help">Help & Guidelines</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        selectedFile ? 'border-healwise-blue' : 'border-gray-300'
                      } hover:border-healwise-blue transition-colors cursor-pointer`}
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      {preview ? (
                        <div className="mb-4">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="max-h-64 mx-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="py-6">
                          <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-2">
                            Drag and drop your medical image here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: DICOM, JPEG, PNG, TIFF (Max size: 50MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*,.dcm"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-healwise-blue hover:bg-blue-600"
                        disabled={!selectedFile || isAnalyzing}
                        onClick={handleAnalyze}
                      >
                        {isAnalyzing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Scan className="mr-2 h-4 w-4" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    {isAnalyzing && (
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Analysis in Progress</h3>
                        <Progress value={45} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Pre-processing</span>
                          <span>Detection</span>
                          <span>Analysis</span>
                        </div>
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-green-500" />
                            <span className="text-sm">Image pre-processing complete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-healwise-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm">Detecting abnormalities...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {analysisComplete && (
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Analysis Results</h3>
                          <Badge className="bg-green-500">Complete</Badge>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Detected Abnormalities</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                  <span className="text-sm">Potential fracture detected</span>
                                </div>
                                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                  85% confidence
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm">Normal bone density</span>
                                </div>
                                <Badge variant="outline" className="text-green-700 border-green-300">
                                  98% confidence
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                            <div className="text-sm space-y-2">
                              <p>• Further examination recommended for potential fracture in distal radius</p>
                              <p>• Comparison with previous imaging advised</p>
                              <p>• Clinical correlation with patient symptoms necessary</p>
                            </div>
                          </div>
                          
                          <Alert className="bg-blue-50 border-blue-200">
                            <Info className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-blue-700 text-sm">
                              This analysis is for informational purposes only and should be verified by a qualified healthcare professional.
                            </AlertDescription>
                          </Alert>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Download Report
                          </Button>
                          <Button size="sm" className="flex-1 bg-healwise-blue hover:bg-blue-600">
                            Share with Doctor
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!isAnalyzing && !analysisComplete && (
                      <div className="border rounded-lg p-6 h-full flex items-center justify-center">
                        <div className="text-center">
                          <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Upload an image and click "Analyze Image" to see results
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <div className="border rounded-lg divide-y">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">Chest X-Ray.jpg</p>
                        <p className="text-xs text-muted-foreground">Analyzed on April 1, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">MRI_Scan_20250315.dcm</p>
                        <p className="text-xs text-muted-foreground">Analyzed on March 15, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">Ultrasound_Report.png</p>
                        <p className="text-xs text-muted-foreground">Analyzed on February 28, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="help" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Supported Image Types</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>DICOM (.dcm) - standard format for medical imaging</li>
                        <li>JPEG (.jpg, .jpeg) - common image format</li>
                        <li>PNG (.png) - lossless image format</li>
                        <li>TIFF (.tif, .tiff) - high-quality image format</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Image Requirements</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Maximum file size: 50MB</li>
                        <li>Minimum resolution: 512x512 pixels</li>
                        <li>Images should be clear and properly oriented</li>
                        <li>Personally identifiable information should be removed</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Use original, unedited medical images</li>
                        <li>Ensure proper lighting and contrast</li>
                        <li>Include all relevant areas in the image</li>
                        <li>Remove any artifacts or obstructions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Data Privacy</h3>
                      <p className="text-sm mb-2">
                        All uploaded images are processed securely and confidentially. 
                        Images are not stored permanently unless you choose to save your analysis.
                      </p>
                      <p className="text-sm">
                        We recommend removing any patient identifiers before uploading images.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Processed Images</CardTitle>
                <Badge>1,245</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileImage className="h-6 w-6 text-healwise-blue" />
                </div>
                <div className="ml-3">
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="text-xs text-muted-foreground">Last 30 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Accuracy Rate</CardTitle>
                <Badge variant="outline">High</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healwise-green">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-2xl font-bold">98.7%</div>
                  <div className="text-xs text-green-500">↑ 1.2% from last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Processing Time</CardTitle>
                <Badge variant="outline">Fast</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-2xl font-bold">4.2s</div>
                  <div className="text-xs text-amber-500">↓ 0.8s from last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Conditions Detected</CardTitle>
                <Badge>150+</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Microscope className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-3">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs text-muted-foreground">Medical conditions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImageAnalysis;
