import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Doctor {
  _id: string;
  name: string;
  email: string;
}

export interface AppointmentData {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  doctorId: {
    _id: string;
    name: string;
    email: string;
  };
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'confirmed';
  type: 'consultation' | 'follow-up' | 'checkup' | 'emergency' | 'routine';
  reason: string;
  symptoms?: string;
  notes?: string;
  patientNotes?: string;
  doctorNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reminderSent: boolean;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  confirmedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctorId: string;
  dateTime: string;
  duration?: number;
  type?: 'consultation' | 'follow-up' | 'checkup' | 'emergency' | 'routine';
  reason: string;
  symptoms?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AvailableSlot {
  dateTime: string;
  time: string;
}

export interface AppointmentStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface AppointmentsResponse {
  success: boolean;
  appointments: AppointmentData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AppointmentResponse {
  success: boolean;
  appointment: AppointmentData;
}

export interface DoctorsResponse {
  success: boolean;
  doctors: Doctor[];
}

export interface AvailableSlotsResponse {
  success: boolean;
  availableSlots: AvailableSlot[];
}

export interface AppointmentStatsResponse {
  success: boolean;
  stats: AppointmentStats;
}

class AppointmentService {
  private getAuthHeaders(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAppointments(
    token: string,
    params: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<AppointmentsResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get<AppointmentsResponse>(
        `${API_BASE_URL}/appointments?${queryParams.toString()}`,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async getAppointmentById(token: string, appointmentId: string): Promise<AppointmentData> {
    try {
      const response = await axios.get<AppointmentResponse>(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        this.getAuthHeaders(token)
      );
      return response.data.appointment;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  async createAppointment(token: string, appointmentData: CreateAppointmentData): Promise<AppointmentData> {
    try {
      const response = await axios.post<AppointmentResponse>(
        `${API_BASE_URL}/appointments`,
        appointmentData,
        this.getAuthHeaders(token)
      );
      return response.data.appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(
    token: string,
    appointmentId: string,
    status: string,
    additionalData: {
      doctorNotes?: string;
      cancellationReason?: string;
    } = {}
  ): Promise<AppointmentData> {
    try {
      const response = await axios.put<AppointmentResponse>(
        `${API_BASE_URL}/appointments/${appointmentId}/status`,
        { status, ...additionalData },
        this.getAuthHeaders(token)
      );
      return response.data.appointment;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  async cancelAppointment(
    token: string,
    appointmentId: string,
    reason?: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        {
          ...this.getAuthHeaders(token),
          data: { reason }
        }
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  async getAvailableDoctors(token: string): Promise<Doctor[]> {
    try {
      const response = await axios.get<DoctorsResponse>(
        `${API_BASE_URL}/appointments/doctors`,
        this.getAuthHeaders(token)
      );
      return response.data.doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  async getAvailableSlots(
    token: string,
    doctorId: string,
    date: string,
    duration: number = 30
  ): Promise<AvailableSlot[]> {
    try {
      const response = await axios.get<AvailableSlotsResponse>(
        `${API_BASE_URL}/appointments/available-slots?doctorId=${doctorId}&date=${date}&duration=${duration}`,
        this.getAuthHeaders(token)
      );
      return response.data.availableSlots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  async getAppointmentStats(token: string): Promise<AppointmentStats> {
    try {
      const response = await axios.get<AppointmentStatsResponse>(
        `${API_BASE_URL}/appointments/stats`,
        this.getAuthHeaders(token)
      );
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
