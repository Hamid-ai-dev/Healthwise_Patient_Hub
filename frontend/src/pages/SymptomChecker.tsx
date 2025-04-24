import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  AlertCircle,
  Heart,
  Thermometer,
  Stethoscope,
  ArrowRight,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import { symptoms, conditions } from '@/data/mockData';
import { Condition, Symptom } from '@/types';

const SymptomChecker = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [matchedConditions, setMatchedConditions] = useState<Condition[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const filteredSymptoms = symptoms.filter((symptom) => 
    symptom.name.toLowerCase().includes(search.toLowerCase()) ||
    symptom.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSymptomToggle = (id: string) => {
    setSelectedSymptoms(current => 
      current.includes(id)
        ? current.filter(s => s !== id)
        : [...current, id]
    );
  };

  const handleAnalyzeSymptoms = () => {
    setAnalyzing(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Match conditions based on selected symptoms
      const matched = conditions.filter(condition => 
        condition.symptoms.some(symptomId => 
          selectedSymptoms.includes(symptomId)
        )
      );
      
      // Sort by number of matching symptoms (most matches first)
      matched.sort((a, b) => {
        const aMatches = a.symptoms.filter(s => selectedSymptoms.includes(s)).length;
        const bMatches = b.symptoms.filter(s => selectedSymptoms.includes(s)).length;
        return bMatches - aMatches;
      });
      
      setMatchedConditions(matched);
      setAnalyzing(false);
      setStep(3);
    }, 2000);
  };

  const getMatchPercentage = (condition: Condition) => {
    const matchingSymptoms = condition.symptoms.filter(s => selectedSymptoms.includes(s));
    return Math.floor((matchingSymptoms.length / condition.symptoms.length) * 100);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Introduction
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">AI Symptom Checker</CardTitle>
              <CardDescription className="text-lg">
                Get insights about your health symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Search className="h-6 w-6 text-healwise-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Identify Symptoms</h3>
                  <p className="text-muted-foreground">
                    Select the symptoms you're experiencing
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <Heart className="h-6 w-6 text-healwise-green" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our system analyzes your symptoms
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-orange-100 p-3 rounded-full mb-4">
                    <Thermometer className="h-6 w-6 text-healwise-orange" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Get Results</h3>
                  <p className="text-muted-foreground">
                    Receive potential conditions and recommendations
                  </p>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Health Notice</AlertTitle>
                <AlertDescription>
                  This symptom checker is not a substitute for professional medical advice, diagnosis, or treatment.
                  Always seek the advice of your physician or other qualified health provider with questions about your medical condition.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-healwise-blue hover:bg-blue-600"
                onClick={() => setStep(2)}
              >
                Start Symptom Check
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 2: // Symptom Selection
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select Your Symptoms</CardTitle>
              <CardDescription>
                Choose all symptoms you're currently experiencing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search symptoms..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="border rounded-lg">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Common Symptoms</span>
                    <Badge>
                      {selectedSymptoms.length} selected
                    </Badge>
                  </div>
                </div>
                <div className="p-2 max-h-[340px] overflow-y-auto">
                  {filteredSymptoms.length > 0 ? (
                    <div className="space-y-2">
                      {filteredSymptoms.map((symptom) => (
                        <div key={symptom.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-md">
                          <Checkbox 
                            id={`symptom-${symptom.id}`}
                            checked={selectedSymptoms.includes(symptom.id)}
                            onCheckedChange={() => handleSymptomToggle(symptom.id)}
                          />
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={`symptom-${symptom.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {symptom.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {symptom.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground">No symptoms found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedSymptoms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Selected Symptoms:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((id) => {
                      const symptom = symptoms.find(s => s.id === id);
                      return symptom && (
                        <Badge key={id} variant="outline" className="flex items-center gap-1">
                          {symptom.name}
                          <button 
                            onClick={() => handleSymptomToggle(id)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18"/>
                              <path d="m6 6 12 12"/>
                            </svg>
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="sm:w-1/3"
              >
                Back
              </Button>
              <Button 
                className="bg-healwise-blue hover:bg-blue-600 sm:w-2/3"
                disabled={selectedSymptoms.length === 0 || analyzing}
                onClick={handleAnalyzeSymptoms}
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );

      case 3: // Results
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Based on the symptoms you provided
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {matchedConditions.length > 0 ? (
                <div className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      We've analyzed your symptoms and found potential conditions that may match.
                      Remember, this is not a diagnosis and should be verified by a healthcare provider.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    {matchedConditions.map((condition) => (
                      <div key={condition.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{condition.name}</h3>
                              <p className="text-muted-foreground text-sm">{condition.description}</p>
                            </div>
                            <Badge className={`${getSeverityColor(condition.severity)} ml-2`}>
                              {condition.severity} risk
                            </Badge>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span>Match likelihood</span>
                              <span className="font-medium">{getMatchPercentage(condition)}%</span>
                            </div>
                            <Progress value={getMatchPercentage(condition)} className="h-2" />
                          </div>
                          
                          <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem value="details">
                              <AccordionTrigger className="text-sm">View Details</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Matching Symptoms:</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {condition.symptoms
                                        .filter(s => selectedSymptoms.includes(s))
                                        .map((symptomId) => {
                                          const symptom = symptoms.find(s => s.id === symptomId);
                                          return symptom && (
                                            <Badge key={symptomId} className="bg-blue-500">
                                              {symptom.name}
                                            </Badge>
                                          );
                                        })}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Treatment Options:</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                      {condition.treatmentOptions.map((treatment, idx) => (
                                        <li key={idx}>{treatment}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  {condition.severity === 'high' && (
                                    <Alert variant="destructive">
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertTitle>Seek Medical Attention</AlertTitle>
                                      <AlertDescription>
                                        This condition requires prompt medical evaluation. Please consult with a healthcare provider as soon as possible.
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-healwise-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Schedule a Consultation</span>
                          <p className="text-sm text-muted-foreground">Talk to a doctor about your symptoms</p>
                          <Button 
                            size="sm" 
                            className="mt-1 bg-healwise-blue hover:bg-blue-600" 
                            asChild
                          >
                            <Link to="/appointments">
                              Book Appointment
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Stethoscope className="h-5 w-5 text-healwise-green flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Monitor Your Symptoms</span>
                          <p className="text-sm text-muted-foreground">
                            Track any changes in your condition and seek immediate medical attention if symptoms worsen
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Matches Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any conditions matching your symptoms. 
                    Please try again with different symptoms or consult a healthcare provider.
                  </p>
                  <Button onClick={() => setStep(2)}>Try Again</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Change Symptoms
              </Button>
              <Button onClick={() => {
                setSelectedSymptoms([]);
                setSearch('');
                setMatchedConditions([]);
                setStep(1);
              }}>
                Start New Check
              </Button>
            </CardFooter>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {step > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Symptom Checker</h1>
              <div className="text-sm text-muted-foreground">
                Step {step} of 3
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-healwise-blue h-2.5 rounded-full" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
    </DashboardLayout>
  );
};

export default SymptomChecker;
