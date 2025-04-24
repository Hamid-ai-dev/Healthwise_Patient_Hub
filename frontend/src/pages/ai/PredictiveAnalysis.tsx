
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Brain, 
  Stethoscope, 
  Heart, 
  Activity, 
  Pill, 
  ArrowRight, 
  CalendarDays, 
  AlertCircle,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Search
} from 'lucide-react';

const PredictiveAnalysis = () => {
  const { toast } = useToast();
  const [riskFactors, setRiskFactors] = useState({
    age: 50,
    bmi: 25,
    smoking: 'No',
    activityLevel: 'Moderate',
  });
  const [prediction, setPrediction] = useState({
    disease: 'Heart Disease',
    probability: 0.65,
    severity: 'High',
  });
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const handleRiskFactorChange = (factor: string, value: any) => {
    setRiskFactors({ ...riskFactors, [factor]: value });
  };

  const handleAnalyze = () => {
    setAnalysisLoading(true);
    // Simulate analysis delay
    setTimeout(() => {
      setPrediction({
        disease: 'Heart Disease',
        probability: Math.random() * 0.8 + 0.2,
        severity: 'High',
      });
      setAnalysisLoading(false);
      toast({
        title: 'Analysis Complete',
        description: 'Predictive analysis completed successfully.',
      });
    }, 1500);
  };

  const COLORS = ['#1E88E5', '#4CAF50', '#FF5722'];

  const severityData = [
    { name: 'Low', value: 15 },
    { name: 'Medium', value: 35 },
    { name: 'High', value: 50 },
  ];

  const lifestyleRecommendations = [
    {
      title: 'Regular Exercise',
      description: 'Engage in at least 30 minutes of moderate-intensity exercise most days of the week.',
      icon: Activity,
    },
    {
      title: 'Healthy Diet',
      description: 'Consume a diet rich in fruits, vegetables, lean proteins, and whole grains.',
      icon: Pill,
    },
    {
      title: 'Quit Smoking',
      description: 'Smoking significantly increases the risk of heart disease and other health issues.',
      icon: Stethoscope,
    },
  ];

  // Helper function to get the appropriate badge variant based on severity
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Predictive Analysis</h1>
          <Button onClick={handleAnalyze} disabled={analysisLoading}>
            {analysisLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Enter risk factors to predict the likelihood of developing certain conditions.
        </p>

        {/* Risk Factors Input */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
            <CardDescription>Enter relevant information to get a prediction.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Age
              </label>
              <Slider
                id="age"
                defaultValue={[riskFactors.age]}
                max={100}
                step={1}
                onValueChange={(value) => handleRiskFactorChange('age', value[0])}
              />
              <p className="text-sm text-muted-foreground">Selected Age: {riskFactors.age}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="bmi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                BMI
              </label>
              <Slider
                id="bmi"
                defaultValue={[riskFactors.bmi]}
                max={40}
                step={0.5}
                onValueChange={(value) => handleRiskFactorChange('bmi', value[0])}
              />
              <p className="text-sm text-muted-foreground">Selected BMI: {riskFactors.bmi}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="smoking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Smoking
              </label>
              <Select onValueChange={(value) => handleRiskFactorChange('smoking', value)}>
                <SelectTrigger id="smoking">
                  <SelectValue placeholder="Select" defaultValue={riskFactors.smoking} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Smoking Status</SelectLabel>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="activityLevel" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Activity Level
              </label>
              <Select onValueChange={(value) => handleRiskFactorChange('activityLevel', value)}>
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select" defaultValue={riskFactors.activityLevel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Activity Level</SelectLabel>
                    <SelectItem value="Sedentary">Sedentary</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
              <CardDescription>Based on the entered risk factors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Brain className="h-8 w-8 text-healwise-blue" />
                <div>
                  <h3 className="text-xl font-semibold">{prediction.disease}</h3>
                  <p className="text-muted-foreground">Predicted Condition</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Probability:</p>
                  <Badge variant="secondary">{`${(prediction.probability * 100).toFixed(2)}%`}</Badge>
                </div>
                <Progress value={prediction.probability * 100} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Severity:</p>
                  <Badge
                    variant={getSeverityVariant(prediction.severity)}
                  >
                    {prediction.severity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lifestyle Recommendations</CardTitle>
              <Badge variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                View All
              </Badge>
            </div>
            <CardDescription>Expert recommendations to improve your health.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {lifestyleRecommendations.map((item, index) => (
              <div key={index} className="space-y-2">
                <item.icon className="h-6 w-6 text-healwise-blue" />
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Insights into predictive analysis trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="probability">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="probability" className="col-span-1">
                  <LineChartIcon className="mr-2 h-4 w-4" />
                  Probability
                </TabsTrigger>
                <TabsTrigger value="severity" className="col-span-1">
                  <BarChartIcon className="mr-2 h-4 w-4" />
                  Severity
                </TabsTrigger>
                <TabsTrigger value="demographics" className="col-span-1">
                  <PieChartIcon className="mr-2 h-4 w-4" />
                  Demographics
                </TabsTrigger>
              </TabsList>
              <Separator className="my-4" />
              <TabsContent value="probability">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: 'Jan', uv: 0.45, pv: 0.24, amt: 2400 },
                        { name: 'Feb', uv: 0.55, pv: 0.13, amt: 2210 },
                        { name: 'Mar', uv: 0.67, pv: 0.22, amt: 2290 },
                        { name: 'Apr', uv: 0.74, pv: 0.35, amt: 2000 },
                        { name: 'May', uv: 0.68, pv: 0.45, amt: 2181 },
                        { name: 'Jun', uv: 0.70, pv: 0.56, amt: 2500 },
                        { name: 'Jul', uv: 0.80, pv: 0.78, amt: 2100 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="severity">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Jan', low: 20, medium: 30, high: 50 },
                        { name: 'Feb', low: 25, medium: 35, high: 40 },
                        { name: 'Mar', low: 30, medium: 40, high: 30 },
                        { name: 'Apr', low: 35, medium: 25, high: 40 },
                        { name: 'May', low: 40, medium: 30, high: 30 },
                        { name: 'Jun', low: 45, medium: 35, high: 20 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="low" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="medium" stackId="a" fill="#ffc658" />
                      <Bar dataKey="high" stackId="a" fill="#d63031" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="demographics">
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Male', value: 400 },
                          { name: 'Female', value: 300 },
                          { name: 'Other', value: 100 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell key="cell-1" fill="#82ca9d" />
                        <Cell key="cell-2" fill="#ffc658" />
                        <Cell key="cell-3" fill="#d63031" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictiveAnalysis;
