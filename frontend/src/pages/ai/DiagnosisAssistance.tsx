
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Brain, FileImage, AlertCircle, Info } from 'lucide-react';

const DiagnosisAssistance = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI-Powered Diagnosis Assistance</h1>
          <p className="text-muted-foreground mt-2">
            Advanced AI tools to assist in medical diagnosis and analysis
          </p>
        </div>

        <Tabs defaultValue="symptom-checker" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="symptom-checker" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Symptom Checker</span>
            </TabsTrigger>
            <TabsTrigger value="predictive-analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Predictive Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="image-analysis" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span>Medical Image Analysis</span>
            </TabsTrigger>
          </TabsList>

          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Medical Disclaimer</AlertTitle>
            <AlertDescription>
              These AI tools are designed to assist healthcare professionals and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider for diagnosis and treatment.
            </AlertDescription>
          </Alert>

          <TabsContent value="symptom-checker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Symptom Checker</CardTitle>
                <CardDescription>
                  Advanced analysis of symptoms to suggest possible conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our comprehensive symptom checker uses advanced AI algorithms to analyze your symptoms and provide 
                  possible conditions based on your input. This tool helps in initial assessment before consulting healthcare professionals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-healwise-blue" />
                      <span>Key Features</span>
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Comprehensive symptom database</li>
                      <li>Machine learning-based condition matching</li>
                      <li>Severity assessment</li>
                      <li>Treatment recommendations</li>
                      <li>Integration with appointment scheduling</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2 text-healwise-blue">How It Works</h3>
                    <p className="text-sm">
                      Input your symptoms, answer a few clarifying questions, and our AI system 
                      will analyze the information against our medical database to provide 
                      potential conditions and recommendations for next steps.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-healwise-blue hover:bg-blue-600" asChild>
                  <a href="/symptom-checker">Go to Symptom Checker</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="predictive-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analysis</CardTitle>
                <CardDescription>
                  AI-powered analysis of medical data to predict potential health conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our predictive analysis tool uses machine learning algorithms to analyze your medical history, 
                  lifestyle factors, and current health metrics to identify potential health risks and suggest 
                  preventive measures.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Brain className="h-5 w-5 text-healwise-green" />
                      </div>
                      <h3 className="font-medium">Risk Assessment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analyzes your health data to identify potential risk factors and calculates 
                      probability scores for various conditions.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healwise-blue">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                      <h3 className="font-medium">Trend Analysis</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Monitors changes in your health metrics over time to identify patterns 
                      and predict potential health issues.
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-amber-50">
                  <div className="flex gap-2 items-start">
                    <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-700">How Predictive Analysis Works</h4>
                      <p className="text-sm text-amber-700">
                        Our AI models analyze thousands of data points from your medical history, 
                        lab results, vital signs, and lifestyle factors. The system identifies patterns 
                        and correlations to predict potential health risks with high accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-healwise-green hover:bg-green-600" asChild>
                  <a href="/ai/predictive-analysis">Access Predictive Analysis</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="image-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Image Analysis</CardTitle>
                <CardDescription>
                  AI-powered analysis of medical images like X-rays, MRIs, and CT scans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our medical image analysis tool uses deep learning algorithms to analyze various medical imaging 
                  formats, helping to identify abnormalities and assisting healthcare professionals in diagnosis.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healwise-blue">
                        <path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" />
                        <path d="M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" />
                        <rect width="8" height="16" x="8" y="4" rx="1" />
                      </svg>
                    </div>
                    <h3 className="font-medium">X-Ray Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analyzes X-ray images to detect fractures, abnormalities, and other conditions.
                    </p>
                    <Badge className="mt-2">98% Accuracy</Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                        <path d="M22 12A10 10 0 0 0 12 2V12H22Z" />
                        <path d="M2 12A10 10 0 0 0 12 22V12H2Z" />
                        <path d="M20 12a8 8 0 0 0-8-8V12H20Z" />
                        <path d="M4 12a8 8 0 0 0 8 8V12H4Z" />
                        <path d="M18 12a6 6 0 0 0-6-6V12H18Z" />
                        <path d="M6 12a6 6 0 0 0 6 6V12H6Z" />
                      </svg>
                    </div>
                    <h3 className="font-medium">MRI Scan Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analyzes MRI scans to detect tumors, tissue damage, and other abnormalities.
                    </p>
                    <Badge className="mt-2">96% Accuracy</Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healwise-green">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8a4 4 0 0 0-8 0" />
                        <path d="M12 8v4" />
                        <path d="M8 16a4 4 0 0 0 8 0" />
                      </svg>
                    </div>
                    <h3 className="font-medium">CT Scan Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analyzes CT scans to detect internal injuries, bleeding, and other conditions.
                    </p>
                    <Badge className="mt-2">95% Accuracy</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-5 bg-muted/30">
                  <h3 className="font-medium mb-3">Upload Your Medical Images</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your medical images securely, and our AI system will analyze them and provide insights.
                    Supported formats: DICOM, JPEG, PNG, TIFF.
                  </p>
                  <Button variant="outline" className="w-full py-8 border-dashed text-muted-foreground">
                    <FileImage className="mr-2 h-5 w-5" />
                    Drop files here or click to upload
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-healwise-blue hover:bg-blue-600" asChild>
                  <a href="/ai/image-analysis">Go to Image Analysis</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DiagnosisAssistance;
