
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  Calendar,
  Check,
  Clock,
  FileText,
  Heart,
  Pill,
  Stethoscope,
  Thermometer,
  TrendingUp,
} from 'lucide-react';

// Mock data for patient history
const vitalHistory = [
  { date: 'Jan', bloodPressure: '120/80', weight: 70, heartRate: 75, bloodSugar: 95 },
  { date: 'Feb', bloodPressure: '122/82', weight: 72, heartRate: 78, bloodSugar: 100 },
  { date: 'Mar', bloodPressure: '118/78', weight: 71, heartRate: 72, bloodSugar: 92 },
  { date: 'Apr', bloodPressure: '125/85', weight: 72, heartRate: 80, bloodSugar: 105 },
  { date: 'May', bloodPressure: '115/75', weight: 69, heartRate: 70, bloodSugar: 90 },
  { date: 'Jun', bloodPressure: '120/80', weight: 68, heartRate: 72, bloodSugar: 88 },
];

const medicationHistory = [
  { name: 'Medication A', adherence: 95 },
  { name: 'Medication B', adherence: 88 },
  { name: 'Medication C', adherence: 76 },
  { name: 'Medication D', adherence: 92 },
];

const conditionRisks = [
  { name: 'Cardiac', value: 15 },
  { name: 'Diabetes', value: 25 },
  { name: 'Hypertension', value: 20 },
  { name: 'Other', value: 40 },
];

const heartRateData = vitalHistory.map(item => ({
  date: item.date,
  value: item.heartRate
}));

const weightData = vitalHistory.map(item => ({
  date: item.date,
  value: item.weight
}));

const bloodSugarData = vitalHistory.map(item => ({
  date: item.date,
  value: item.bloodSugar
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HistoryAnalysis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    toast({
      title: "Analysis Started",
      description: "Our AI is analyzing your health data",
    });
    
    // Simulate analysis completion after 2 seconds
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Your health data analysis is ready to view",
      });
    }, 2000);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Health Analysis</h1>
            <p className="text-muted-foreground">AI-powered insights based on your medical history</p>
          </div>
          <Button 
            onClick={handleRunAnalysis} 
            disabled={isAnalyzing} 
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain size={16} />
                Run New Analysis
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Health Summary</CardTitle>
              <CardDescription>
                Based on your recent health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Heart Rate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">72</span>
                    <span className="text-sm text-muted-foreground ml-1">bpm</span>
                    <Badge className="ml-2 bg-green-500">Normal</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Blood Pressure</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">120/80</span>
                    <span className="text-sm text-muted-foreground ml-1">mmHg</span>
                    <Badge className="ml-2 bg-green-500">Normal</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Blood Sugar</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">88</span>
                    <span className="text-sm text-muted-foreground ml-1">mg/dL</span>
                    <Badge className="ml-2 bg-green-500">Normal</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Weight Trend</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">-2 kg</span>
                    <span className="text-sm text-muted-foreground ml-1">last 3m</span>
                    <Badge className="ml-2 bg-green-500">Improving</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Medication Adherence</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">92%</span>
                    <Badge className="ml-2 bg-blue-500">Good</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-base font-medium mb-3">Risk Assessment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cardiac Risk</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Diabetes Risk</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Hypertension Risk</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                Health insights based on your complete medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisComplete ? (
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Health Trends</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                            <Brain className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-900">AI Analysis Summary</h3>
                            <p className="text-sm text-blue-800 mt-1">
                              Based on your medical history, you're maintaining good overall health. 
                              Your vital signs are within normal ranges, with slight improvements in 
                              weight and blood pressure over the last 3 months. Continue your current 
                              lifestyle habits and medication regimen.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Positive Indicators
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Weight trending downward over last 3 months</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Blood pressure consistently in normal range</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Good medication adherence (92%)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Normal resting heart rate in healthy range</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Areas for Attention
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <span>Blood sugar occasionally elevated after meals</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <span>Medication C adherence could be improved (76%)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <span>Moderate risk of developing type 2 diabetes (25%)</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Risk Breakdown</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={conditionRisks}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {conditionRisks.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trends">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Heart Rate Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={heartRateData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#FF6384" 
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  name="Heart Rate (bpm)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Weight Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#36A2EB" 
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  name="Weight (kg)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Blood Sugar Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={bloodSugarData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#4BC0C0" 
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  name="Blood Sugar (mg/dL)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Medication Adherence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={medicationHistory}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar 
                                  dataKey="adherence" 
                                  fill="#8884d8" 
                                  name="Adherence (%)"
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations">
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full mt-0.5">
                            <Brain className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-green-900">AI Recommendations</h3>
                            <p className="text-sm text-green-800 mt-1">
                              Based on our analysis of your health data, here are personalized 
                              recommendations to help you maintain and improve your overall health.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Pill className="h-4 w-4" />
                              Medication
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Set daily reminders for Medication C to improve adherence</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Continue current dosage of all medications</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Next medication review recommended in 3 months</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Lifestyle
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Continue with current exercise routine of 30 minutes, 3-4 times weekly</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Maintain reduced carbohydrate intake to keep blood sugar stable</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Consider adding 10 minutes of stress reduction techniques daily</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Checkups
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Schedule follow-up blood work in 4 weeks to check blood sugar</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Annual physical examination recommended in 2 months</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Consider diabetes screening due to moderately elevated risk</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Monitoring
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Continue daily blood pressure monitoring</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Check blood sugar before and 2 hours after meals twice weekly</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Track weight weekly to maintain positive trend</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Detailed Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm">
                              Our AI analysis suggests the following personalized health plan to 
                              address your specific needs and risk factors:
                            </p>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Next 30 Days</h4>
                              <ul className="text-sm space-y-1">
                                <li className="flex gap-2">
                                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Follow up with dietitian to review meal plan</span>
                                </li>
                                <li className="flex gap-2">
                                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Complete blood work and bring results to next appointment</span>
                                </li>
                                <li className="flex gap-2">
                                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Set up medication reminder system for Medication C</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Next 90 Days</h4>
                              <ul className="text-sm space-y-1">
                                <li className="flex gap-2">
                                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Schedule and complete annual physical examination</span>
                                </li>
                                <li className="flex gap-2">
                                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Medication review with primary physician</span>
                                </li>
                                <li className="flex gap-2">
                                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Diabetes screening and risk assessment</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Long Term Goals</h4>
                              <ul className="text-sm space-y-1">
                                <li className="flex gap-2">
                                  <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Maintain weight in current healthy range</span>
                                </li>
                                <li className="flex gap-2">
                                  <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Reduce diabetes risk from 25% to below 15%</span>
                                </li>
                                <li className="flex gap-2">
                                  <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Achieve 95%+ adherence for all medications</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analysis Not Started</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Run an AI analysis to get personalized insights based on your medical history and health metrics.
                    </p>
                    <Button onClick={handleRunAnalysis} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoryAnalysis;
