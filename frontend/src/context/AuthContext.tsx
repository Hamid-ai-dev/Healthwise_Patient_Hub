import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Patient, Doctor, Admin } from '@/types';
import { users, patients, doctors, admins } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios'; // Import axios for API calls

interface AuthContextType {
  user: User | null;
  patientData: Patient | null;
  doctorData: Doctor | null;
  adminData: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  Doctorprofiledata: (data: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('healwise_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserData(parsedUser);
    }
    setLoading(false);
  }, []);

  const Doctorprofiledata = async (data: any) => {
    const response = await fetch('http://localhost:5000/api/doctor/submitDoctorVerification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Submission failed');

    console.log('Success:', result);
    alert('Profile submitted successfully!');
  };

  const loadUserData = (userData: User) => {
    if (userData.role === 'patient') {
      const patientData = patients.find(p => p.id === userData.id);
      if (patientData) setPatientData(patientData);
    } else if (userData.role === 'doctor') {
      const doctorData = doctors.find(d => d.id === userData.id);
      if (doctorData) setDoctorData(doctorData);
    } else if (userData.role === 'admin') {
      const adminData = admins.find(a => a.id === userData.id);
      if (adminData) setAdminData(adminData);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 🔗 Send login request to backend
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
  
      const matchedUser = response.data.user;
  
      // Set user in context/state
      setUser(matchedUser);
      loadUserData(matchedUser);
  
      // Store user in localStorage for session persistence
      localStorage.setItem('healwise_user', JSON.stringify(matchedUser));
  
      toast({
        title: "Login successful",
        description: `Welcome back, ${matchedUser.name}!`,
      });
  
      // Navigate based on user role
      if (matchedUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (matchedUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (matchedUser.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || (error instanceof Error ? error.message : "An unknown error occurred"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      // Send registration data to backend
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role
      });

      // Show success message
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      });

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      // Handle error from backend
      const errorMessage = error.response?.data?.message || "An unknown error occurred";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  

  const logout = () => {
    setUser(null);
    setPatientData(null);
    setDoctorData(null);
    setAdminData(null);
    localStorage.removeItem('healwise_user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      patientData,
      doctorData,
      adminData,
      login, 
      register, 
      logout,
      loading,
      Doctorprofiledata
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};