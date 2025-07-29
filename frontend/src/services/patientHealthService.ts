import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Health Metrics Interfaces
export interface HealthMetrics {
  height: string;
  weight: number;
  bloodPressure: string;
  heartRate: string;
  bmi: string | null;
  lastUpdated: string;
}

export interface PatientOverview {
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  email: string;
  image?: string;
  doctor: {
    _id: string;
    name: string;
    email: string;
  };
  queries: string[];
  healthMetrics: HealthMetrics;
}

export interface HealthHistoryRecord {
  date: string;
  weight: number;
  heartRate: number;
  bloodPressure: string;
  bmi: string | null;
  doctor: string;
}

export interface HealthMetricsData {
  current: HealthMetrics;
  history: HealthHistoryRecord[];
  recordCount: number;
}

export interface HealthTrend {
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export interface HealthStats {
  totalRecords: number;
  lastCheckup: string;
  healthStatus: 'good' | 'attention' | 'critical';
  trends: {
    weight?: HealthTrend;
    heartRate?: HealthTrend;
  };
  currentDoctor: string;
}

// Report Interfaces
export interface PatientReport {
  _id: string;
  type: string;
  date: string;
  status: 'pending' | 'completed' | 'reviewed';
  pdfPath: string;
  doctor: {
    name: string;
    email: string;
  };
  patient: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  completed: number;
  reviewed: number;
  latest: {
    type: string;
    date: string;
    status: string;
    doctor: string;
  } | null;
  typeBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

// API Response Interfaces
export interface HealthOverviewResponse {
  success: boolean;
  data: PatientOverview;
}

export interface HealthMetricsResponse {
  success: boolean;
  data: HealthMetricsData;
}

export interface HealthStatsResponse {
  success: boolean;
  data: HealthStats;
}

export interface ReportsResponse {
  success: boolean;
  data: PatientReport[];
  count: number;
}

export interface ReportResponse {
  success: boolean;
  data: PatientReport;
}

export interface ReportStatsResponse {
  success: boolean;
  data: ReportStats;
}

class PatientHealthService {
  private getAuthHeaders(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  // Health Overview Methods
  async getHealthOverview(token: string): Promise<PatientOverview> {
    try {
      const response = await axios.get<HealthOverviewResponse>(
        `${API_BASE_URL}/patient/health/overview`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching health overview:', error);
      throw error;
    }
  }

  async getHealthMetrics(token: string): Promise<HealthMetricsData> {
    try {
      const response = await axios.get<HealthMetricsResponse>(
        `${API_BASE_URL}/patient/health/metrics`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      throw error;
    }
  }

  async getHealthStats(token: string): Promise<HealthStats> {
    try {
      const response = await axios.get<HealthStatsResponse>(
        `${API_BASE_URL}/patient/health/stats`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching health stats:', error);
      throw error;
    }
  }

  // Reports Methods
  async getPatientReports(token: string): Promise<PatientReport[]> {
    try {
      const response = await axios.get<ReportsResponse>(
        `${API_BASE_URL}/patient/reports`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      throw error;
    }
  }

  async getReportById(token: string, reportId: string): Promise<PatientReport> {
    try {
      const response = await axios.get<ReportResponse>(
        `${API_BASE_URL}/patient/reports/${reportId}`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async downloadReport(token: string, reportId: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/patient/reports/${reportId}/download`,
        {
          ...this.getAuthHeaders(token),
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  async getReportStats(token: string): Promise<ReportStats> {
    try {
      const response = await axios.get<ReportStatsResponse>(
        `${API_BASE_URL}/patient/reports/stats`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report stats:', error);
      throw error;
    }
  }

  // Utility Methods
  formatHealthMetricsForChart(history: HealthHistoryRecord[]): Array<{name: string, value: number}> {
    return history.map((record, index) => ({
      name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: record.heartRate || 0
    }));
  }

  getHealthStatusColor(status: string): string {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'attention':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getTrendIcon(direction: string): string {
    switch (direction) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  }
}

export const patientHealthService = new PatientHealthService();
