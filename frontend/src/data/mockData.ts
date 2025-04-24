
import { 
  User, Patient, Doctor, Admin, Appointment, Prescription, 
  MedicalReport, HealthMetrics, Symptom, Condition
} from '@/types';

// Users
export const users: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe', role: 'patient' },
  { id: '2', email: 'sarah@example.com', name: 'Dr. Sarah Wilson', role: 'doctor' },
  { id: '3', email: 'mike@example.com', name: 'Mike Johnson', role: 'patient' },
  { id: '4', email: 'emma@example.com', name: 'Dr. Emma Davis', role: 'doctor' },
  { id: '5', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
];

// Patients
export const patients: Patient[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'patient',
    healthMetrics: {
      height: 180,
      weight: 75,
      bloodPressure: '120/80',
      heartRate: 72,
      bloodSugar: 90,
      lastUpdated: '2023-04-15'
    }
  },
  {
    id: '3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    role: 'patient',
    healthMetrics: {
      height: 175,
      weight: 82,
      bloodPressure: '130/85',
      heartRate: 68,
      bloodSugar: 95,
      lastUpdated: '2023-05-20'
    }
  },
];

// Doctors
export const doctors: Doctor[] = [
  {
    id: '2',
    email: 'sarah@example.com',
    name: 'Dr. Sarah Wilson',
    role: 'doctor',
    specialty: 'Cardiology',
    ratings: 4.8,
    patients: ['1', '3'],
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '13:00' },
    ]
  },
  {
    id: '4',
    email: 'emma@example.com',
    name: 'Dr. Emma Davis',
    role: 'doctor',
    specialty: 'Pediatrics',
    ratings: 4.9,
    patients: ['3'],
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00' },
    ]
  },
];

// Admins
export const admins: Admin[] = [
  {
    id: '5',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  },
];

// Appointments
export const appointments: Appointment[] = [
  {
    id: 'app1',
    patientId: '1',
    doctorId: '2',
    dateTime: '2023-06-15T10:30:00',
    status: 'completed',
    notes: 'Regular checkup, patient reported mild chest pain.'
  },
  {
    id: 'app2',
    patientId: '3',
    doctorId: '4',
    dateTime: '2023-06-20T14:00:00',
    status: 'scheduled',
    notes: 'Follow-up appointment for flu symptoms.'
  },
  {
    id: 'app3',
    patientId: '1',
    doctorId: '2',
    dateTime: '2023-07-10T11:00:00',
    status: 'scheduled',
    notes: 'Follow-up for medication effectiveness.',
    followUp: true
  },
];

// Prescriptions
export const prescriptions: Prescription[] = [
  {
    id: 'presc1',
    patientId: '1',
    doctorId: '2',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '3 months'
      },
      {
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: '3 months'
      }
    ],
    issueDate: '2023-06-15',
    endDate: '2023-09-15',
    notes: 'Take with food in the morning.'
  }
];

// Medical Reports
export const medicalReports: MedicalReport[] = [
  {
    id: 'report1',
    patientId: '1',
    doctorId: '2',
    type: 'Blood Test',
    date: '2023-06-15',
    results: 'Normal cholesterol levels, slightly elevated blood pressure.',
    aiAnalysis: 'Consider dietary changes and monitoring blood pressure regularly.'
  },
  {
    id: 'report2',
    patientId: '1',
    doctorId: '2',
    type: 'ECG',
    date: '2023-06-15',
    results: 'Normal sinus rhythm, no significant abnormalities detected.',
    aiAnalysis: 'Heart functioning normally, continue regular monitoring.'
  }
];

// Symptoms for symptom checker
export const symptoms: Symptom[] = [
  { id: 'sym1', name: 'Headache', description: 'Pain in the head or upper neck' },
  { id: 'sym2', name: 'Fever', description: 'Elevated body temperature' },
  { id: 'sym3', name: 'Cough', description: 'Sudden expulsion of air from the lungs' },
  { id: 'sym4', name: 'Fatigue', description: 'Feeling of tiredness or exhaustion' },
  { id: 'sym5', name: 'Sore throat', description: 'Pain or irritation in the throat' },
  { id: 'sym6', name: 'Chest pain', description: 'Pain or discomfort in the chest area' },
  { id: 'sym7', name: 'Shortness of breath', description: 'Difficulty breathing or catching breath' },
  { id: 'sym8', name: 'Nasal congestion', description: 'Blockage or stuffiness in nasal passages' },
  { id: 'sym9', name: 'Dizziness', description: 'Feeling lightheaded or unbalanced' },
  { id: 'sym10', name: 'Nausea', description: 'Feeling of sickness with an inclination to vomit' },
];

// Possible conditions for symptom checker
export const conditions: Condition[] = [
  {
    id: 'cond1',
    name: 'Common Cold',
    description: 'A viral infectious disease of the upper respiratory tract',
    symptoms: ['sym3', 'sym5', 'sym8'],
    treatmentOptions: ['Rest', 'Hydration', 'Over-the-counter cold medications'],
    severity: 'low'
  },
  {
    id: 'cond2',
    name: 'Influenza',
    description: 'A viral infection that attacks the respiratory system',
    symptoms: ['sym2', 'sym3', 'sym4', 'sym5'],
    treatmentOptions: ['Rest', 'Fluids', 'Antiviral medications if diagnosed early'],
    severity: 'medium'
  },
  {
    id: 'cond3',
    name: 'COVID-19',
    description: 'A respiratory illness caused by the SARS-CoV-2 virus',
    symptoms: ['sym2', 'sym3', 'sym4', 'sym7'],
    treatmentOptions: ['Rest', 'Isolation', 'Consult healthcare provider'],
    severity: 'high'
  },
  {
    id: 'cond4',
    name: 'Migraine',
    description: 'A headache of varying intensity with nausea and sensitivity to light and sound',
    symptoms: ['sym1', 'sym9', 'sym10'],
    treatmentOptions: ['Rest in a dark room', 'Pain relievers', 'Preventative medications'],
    severity: 'medium'
  },
  {
    id: 'cond5',
    name: 'Hypertension',
    description: 'High blood pressure that can lead to severe health complications',
    symptoms: ['sym1', 'sym6', 'sym9'],
    treatmentOptions: ['Medication', 'Lifestyle changes', 'Regular monitoring'],
    severity: 'high'
  }
];
