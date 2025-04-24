import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import {
  Users,
  User,
  Heart,
  Activity,
  Settings,
  CreditCard,
  AlertCircle,
  Server,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { patients, doctors, users } from '@/data/mockData';

// Mock data for charts (unchanged)
const usageData = [
  { name: 'Jan', patients: 250, doctors: 20 },
  { name: 'Feb', patients: 320, doctors: 23 },
  { name: 'Mar', patients: 350, doctors: 25 },
  { name: 'Apr', patients: 410, doctors: 30 },
  { name: 'May', patients: 480, doctors: 35 },
  { name: 'Jun', patients: 520, doctors: 38 },
];

const systemHealthData = [
  { name: 'CPU', value: 35 },
  { name: 'Memory', value: 50 },
  { name: 'Storage', value: 25 },
];

const COLORS = ['#1E88E5', '#4CAF50', '#FF5722'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added for navigation
  const [alerts, setAlerts] = useState<any[]>([]); // Removed hardcoded data, added type

  // Fetch alerts from backend on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  const userCountData = [
    { name: 'Users', patients: patients.length, doctors: doctors.length, admins: 1 },
  ];

  // Mock statistics (unchanged)
  const stats = {
    totalUsers: users.length,
    activeUsers: Math.floor(users.length * 0.85),
    totalAppointments: 150,
    totalRevenue: 15670,
    systemUptime: '99.8%',
    averageResponseTime: '0.8s'
  };

  // Get initials for avatar (unchanged)
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
        
        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-healwise-blue" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="text-green-600 font-medium">↑ 12%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-healwise-green" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="text-green-600 font-medium">↑ 8%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="text-amber-600 font-medium">↑ 15%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Growth & Statistics */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Monthly users and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={usageData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="patients"
                        stroke="#1E88E5"
                        name="Patients"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="doctors"
                        stroke="#4CAF50"
                        name="Doctors"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>By role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userCountData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" hide />
                        <Tooltip />
                        <Bar dataKey="patients" name="Patients" fill="#1E88E5" stackId="a" />
                        <Bar dataKey="doctors" name="Doctors" fill="#4CAF50" stackId="a" />
                        <Bar dataKey="admins" name="Admins" fill="#FF5722" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#1E88E5] mr-1"></div>
                      <span className="text-sm">Patients</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4CAF50] mr-1"></div>
                      <span className="text-sm">Doctors</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#FF5722] mr-1"></div>
                      <span className="text-sm">Admins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                  <CardDescription>Current usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={systemHealthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {systemHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                    <div>
                      <div className="font-medium">Uptime</div>
                      <div className="text-muted-foreground">{stats.systemUptime}</div>
                    </div>
                    <div>
                      <div className="font-medium">Response</div>
                      <div className="text-muted-foreground">{stats.averageResponseTime}</div>
                    </div>
                    <div>
                      <div className="font-medium">Status</div>
                      <div className="text-green-600">Operational</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Alerts & Quick Access */}
          <div className="space-y-5">
            {/* System Alerts */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>System Alerts</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {alerts.length} alerts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert._id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className={`p-2 rounded-full ${
                        alert.severity === 'high'
                          ? 'bg-red-100'
                          : alert.severity === 'medium'
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                      }`}>
                        <AlertCircle className={`h-5 w-5 ${
                          alert.severity === 'high'
                            ? 'text-red-600'
                            : alert.severity === 'medium'
                              ? 'text-amber-600'
                              : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <Badge variant={
                            alert.severity === 'high'
                              ? 'destructive'
                              : alert.severity === 'medium'
                                ? 'outline'
                                : 'default'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-gray-500">{new Date(alert.time).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/admin/alerts')}>
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Users */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Users</CardTitle>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-healwise-blue text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.role}</div>
                      </div>
                      <Badge variant={
                        user.role === 'admin'
                          ? 'destructive'
                          : user.role === 'doctor'
                            ? 'outline'
                            : 'default'
                      }>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Administrative Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/doctors">
                    <Heart className="mr-2 h-4 w-4" />
                    Manage Doctors
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/patients">
                    <User className="mr-2 h-4 w-4" />
                    Manage Patients
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* System Health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded">
                        <Server className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">API Server</p>
                        <p className="text-sm text-muted-foreground">Operational</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Security</p>
                        <p className="text-sm text-muted-foreground">All checks passed</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Secure</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-muted-foreground">Healthy</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500">Stable</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;