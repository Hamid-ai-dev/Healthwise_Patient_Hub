export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

export interface Patient extends User {
  role: 'patient';
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  notes?: string;
  medicalHistory?: MedicalHistory[];
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  reports?: MedicalReport[];
  healthMetrics?: HealthMetrics;
  queries?: PatientQuery[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  patients?: string[];
  appointments?: Appointment[];
  ratings?: number;
  reviews?: Review[];
  availability?: DoctorAvailability[];
}

export interface Admin extends User {
  role: 'admin';
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  diagnosisDate: string;
  treatment: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type?: string;
  notes?: string;
  followUp?: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  issueDate: string;
  endDate: string;
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId?: string;
  type: string;
  date: string;
  results: string;
  fileUrl?: string;
  aiAnalysis?: string;
}

export interface HealthMetrics {
  height?: number;
  weight?: number;
  bloodPressure?: string;
  heartRate?: number;
  bloodSugar?: number;
  lastUpdated: string;
}

export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatmentOptions: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'document';
}

export interface HealthPlan {
  id: string;
  patientId: string;
  diet: DietPlan;
  workout: WorkoutPlan;
  createdDate: string;
  endDate: string;
}

export interface DietPlan {
  calories: number;
  meals: Meal[];
  restrictions: string[];
  recommendations: string[];
}

export interface Meal {
  name: string;
  time: string;
  foods: string[];
}

export interface WorkoutPlan {
  frequency: number;
  exercises: Exercise[];
  duration: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
}

export interface PatientQuery {
  id: string;
  patientId: string;
  doctorId: string;
  message: string;
  response?: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: string;
  updatedAt?: string;
}
