
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Home, User, Calendar, FileText, MessageSquare, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get profile route based on user role
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="healwise-gradient p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healwise-blue to-healwise-green">
              HealWise
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-healwise-blue">Home</Link>
            <Link to="/doctors" className="text-sm font-medium hover:text-healwise-blue">Doctors</Link>
            <Link to="/services" className="text-sm font-medium hover:text-healwise-blue">Services</Link>
            <Link to="/about" className="text-sm font-medium hover:text-healwise-blue">About</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-healwise-blue">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-healwise-blue text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                {user.role === 'patient' && (
                  <DropdownMenuItem asChild>
                    <Link to="/patient-dashboard" className="cursor-pointer flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === 'doctor' && (
                  <DropdownMenuItem asChild>
                    <Link to="/doctor-dashboard" className="cursor-pointer flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard" className="cursor-pointer flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to={getProfileRoute()} className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/appointments" className="cursor-pointer flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Appointments</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/medical-records" className="cursor-pointer flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Medical Records</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="cursor-pointer flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-healwise-blue hover:bg-blue-600">Sign Up</Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 pt-2 bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-healwise-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/doctors" 
              className="text-sm font-medium hover:text-healwise-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Doctors
            </Link>
            <Link 
              to="/services" 
              className="text-sm font-medium hover:text-healwise-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium hover:text-healwise-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium hover:text-healwise-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-healwise-blue hover:bg-blue-600">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
