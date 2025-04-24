import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Activity,
  Users,
  Search,
  Heart,
  FilePlus,
  Pill,
  ChefHat,
  Dumbbell,
  Brain,
  FileImage,
  Stethoscope,
  UserRound
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsCount] = useState(3);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const aiMenuItems = [
    { title: 'Diagnosis Assistance', icon: Stethoscope, path: '/ai/diagnosis-assistance' },
    { title: 'Predictive Analysis', icon: Brain, path: '/ai/predictive-analysis' },
    { title: 'Image Analysis', icon: FileImage, path: '/ai/image-analysis' },
    { title: 'Symptom Checker', icon: Search, path: '/symptom-checker' },
  ];

  const patientMenuItems = [
    { title: 'Dashboard', icon: Home, path: '/patient-dashboard' },
    { title: 'Profile', icon: User, path: '/patient-profile' },
    { title: 'Appointments', icon: Calendar, path: '/appointments' },
    { title: 'Medical Records', icon: FileText, path: '/medical-records' },
    { title: 'Messages', icon: MessageSquare, path: '/messages' },
    { title: 'Health Metrics', icon: Activity, path: '/health-metrics' },
    { title: 'Prescriptions', icon: Pill, path: '/prescriptions' },
    { title: 'Diet Plans', icon: ChefHat, path: '/diet-plans' },
    { title: 'Workout Plans', icon: Dumbbell, path: '/workout-plans' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const doctorMenuItems = [
    { title: 'Dashboard', icon: Home, path: '/doctor-dashboard' },
    { title: 'Profile', icon: User, path: '/doctor-profile' },
    { title: 'My Patients', icon: UserRound, path: '/patients' },
    { title: 'Medical Records', icon: FileText, path: '/medical-records' },
    { title: 'Create Report', icon: FilePlus, path: '/create-report' },
    { title: 'Analyze Images', icon: FileImage, path: '/analyze-images' },
    { title: 'Appointments', icon: Calendar, path: '/appointments' },
    { title: 'Messages', icon: MessageSquare, path: '/messages' },
    { title: 'Prescriptions', icon: Pill, path: '/prescriptions' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const adminMenuItems = [
    { title: 'Dashboard', icon: Home, path: '/admin-dashboard' },
    { title: 'Users', icon: Users, path: '/admin/users' },
    { title: 'Doctors', icon: Heart, path: '/admin/doctors' },
    { title: 'Patients', icon: User, path: '/admin/patients' },
    { title: 'Reports', icon: FileText, path: '/admin/reports' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'patient':
        return patientMenuItems;
      case 'doctor':
        return doctorMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = getMenuItems();

  const getProfileRoute = () => {
    if (!user) return '/profile';
    
    switch (user.role) {
      case 'doctor':
        return '/doctor-profile';
      case 'patient':
        return '/patient-profile';
      case 'admin':
        return '/admin-profile';
      default:
        return '/profile';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-center justify-between p-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="healwise-gradient p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </span>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-healwise-blue to-healwise-green">
                HealWise
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton 
                        asChild
                        className={location.pathname === item.path ? "bg-primary text-primary-foreground" : ""}
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>AI Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiMenuItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton 
                        asChild
                        className={location.pathname === item.path ? "bg-primary text-primary-foreground" : ""}
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-2">
                  <Link 
                    to={getProfileRoute()} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="bg-healwise-blue text-white">
                        {user ? getInitials(user.name) : ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </Link>
                </div>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-700">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="border-b bg-white">
            <div className="flex h-16 items-center px-4 justify-between">
              <div className="flex items-center">
                <SidebarTrigger />
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {notificationsCount}
                    </Badge>
                  )}
                </Button>
                <Link to={getProfileRoute()}>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-healwise-blue text-white text-xs">
                      {user ? getInitials(user.name) : ''}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </div>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
