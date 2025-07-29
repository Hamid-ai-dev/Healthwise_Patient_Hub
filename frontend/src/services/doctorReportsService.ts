import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Doctor Report Interfaces
export interface DoctorReportPatient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address?: string;
}

export interface DoctorReportDoctor {
  _id: string;
  name: string;
  email: string;
}

export interface DoctorReport {
  _id: string;
  type: string;
  date: string;
  status: 'pending' | 'completed' | 'reviewed';
  pdfPath: string;
  patient: DoctorReportPatient;
  doctor: DoctorReportDoctor;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsPagination {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ReportsStats {
  total: number;
  pending: number;
  completed: number;
  reviewed: number;
  latest: Array<{
    _id: string;
    type: string;
    date: string;
    status: string;
    patientName: string;
  }>;
  typeBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

// API Response Interfaces
export interface DoctorReportsResponse {
  success: boolean;
  data: DoctorReport[];
  pagination: ReportsPagination;
}

export interface DoctorReportResponse {
  success: boolean;
  data: DoctorReport;
}

export interface ReportsStatsResponse {
  success: boolean;
  data: ReportsStats;
}

// Search and Filter Parameters
export interface ReportsSearchParams {
  search?: string;
  patientId?: string;
  status?: 'pending' | 'completed' | 'reviewed';
  type?: string;
  page?: number;
  limit?: number;
}

class DoctorReportsService {
  private getAuthHeaders(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  // Get all reports for the current doctor with search and filters
  async getDoctorReports(token: string, params: ReportsSearchParams = {}): Promise<{reports: DoctorReport[], pagination: ReportsPagination}> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.patientId) queryParams.append('patientId', params.patientId);
      if (params.status) queryParams.append('status', params.status);
      if (params.type) queryParams.append('type', params.type);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axios.get<DoctorReportsResponse>(
        `${API_BASE_URL}/doctor/reports?${queryParams.toString()}`,
        this.getAuthHeaders(token)
      );
      
      return {
        reports: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error fetching doctor reports:', error);
      throw error;
    }
  }

  // Get a specific report by ID
  async getReportById(token: string, reportId: string): Promise<DoctorReport> {
    try {
      const response = await axios.get<DoctorReportResponse>(
        `${API_BASE_URL}/doctor/reports/${reportId}`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  // Download a report PDF
  async downloadReport(token: string, reportId: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/doctor/reports/${reportId}/download`,
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

  // Get report view URL for opening in new tab
  getReportViewUrl(token: string, reportId: string): string {
    return `${API_BASE_URL}/doctor/reports/${reportId}/view?token=${token}`;
  }

  // View report in new tab
  async viewReport(token: string, reportId: string): Promise<void> {
    try {
      const url = this.getReportViewUrl(token, reportId);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing report:', error);
      throw error;
    }
  }

  // Get reports statistics
  async getReportsStats(token: string): Promise<ReportsStats> {
    try {
      const response = await axios.get<ReportsStatsResponse>(
        `${API_BASE_URL}/doctor/reports/stats`,
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports stats:', error);
      throw error;
    }
  }

  // Utility Methods
  formatReportDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  getTimeSince(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
      return dateString;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'reviewed':
        return 'outline';
      default:
        return 'outline';
    }
  }

  // Download report with proper filename
  async downloadReportWithFilename(token: string, reportId: string, report: DoctorReport): Promise<void> {
    try {
      const blob = await this.downloadReport(token, reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.patient.name}_${report.type}_${this.formatReportDate(report.date)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report with filename:', error);
      throw error;
    }
  }
}

export const doctorReportsService = new DoctorReportsService();
