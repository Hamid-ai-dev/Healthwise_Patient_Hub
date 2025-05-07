import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Patient, Doctor, Admin } from '@/types';
// Keep mock data for loading associated patient/doctor/admin details for now
import { patients, doctors, admins } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface AuthContextType { 
  user: User | null;
  token: string | null; // Added token state
  patientData: Patient | null;
  doctorData: Doctor | null;
  adminData: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the expected shape of the login response from the backend
interface LoginResponse {
    user: User;
    token: string;
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // State for JWT token
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('healwise_user');
    const storedToken = localStorage.getItem('healwise_token'); // Load token too

    if (storedUser && storedToken) {
      try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken); // Set token from storage
          loadUserData(parsedUser); // Load associated data
      } catch (error) {
          console.error("Failed to parse stored user data:", error);
          // Clear potentially corrupted storage
          localStorage.removeItem('healwise_user');
          localStorage.removeItem('healwise_token');
      }
    }
    setLoading(false);
  }, []);

  // Still using mock data to load associated Patient/Doctor/Admin details
  // In a real app, you might fetch this based on the user ID after login
  const loadUserData = (userData: User) => {
    setPatientData(null); // Reset other roles
    setDoctorData(null);
    setAdminData(null);
    if (userData.role === 'patient') {
      const foundPatientData = patients.find(p => p.id === userData.id); // Using mock data ID matching user ID
      if (foundPatientData) setPatientData(foundPatientData);
    } else if (userData.role === 'doctor') {
      const foundDoctorData = doctors.find(d => d.id === userData.id); // Using mock data ID matching user ID
      if (foundDoctorData) setDoctorData(foundDoctorData);
    } else if (userData.role === 'admin') {
      const foundAdminData = admins.find(a => a.id === userData.id); // Using mock data ID matching user ID
      if (foundAdminData) setAdminData(foundAdminData);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Assumes backend returns { user: User, token: string }
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/login', {
        email,
        password,
      });

      const loggedInUser = response.data.user;
      const receivedToken = response.data.token;

      setUser(loggedInUser);
      setToken(receivedToken); // Set the token state
      loadUserData(loggedInUser);

      localStorage.setItem('healwise_user', JSON.stringify(loggedInUser));
      localStorage.setItem('healwise_token', receivedToken); // Store the token

      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.name}!`,
      });

      if (loggedInUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (loggedInUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error: any) { // Use 'any' or a more specific error type if known
       console.error("Login error:", error.response?.data || error.message);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || (error instanceof Error ? error.message : "An unknown error occurred"),
        variant: "destructive",
      });
       setUser(null); // Ensure user/token are null on failure
       setToken(null);
       localStorage.removeItem('healwise_user');
       localStorage.removeItem('healwise_token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      });
      navigate('/login');
    } catch (error: any) { // Use 'any' or a more specific error type
       console.error("Registration error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "An unknown error occurred during registration.";
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
    setToken(null); // Clear token state
    setPatientData(null);
    setDoctorData(null);
    setAdminData(null);
    localStorage.removeItem('healwise_user');
    localStorage.removeItem('healwise_token'); // Remove token from storage
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token, // Provide token in context value
      patientData,
      doctorData,
      adminData,
      login,
      register,
      logout,
      loading
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