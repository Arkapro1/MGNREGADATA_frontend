import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://72.60.196.209:5000/api';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds to handle slow queries
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export interface State {
  state_name: string;
  state_code: string;
  total_districts: number;
  last_synced: string;
}

export interface District {
  district_name: string;
  district_code: string;
  last_synced: string;
}

export interface PerformanceData {
  state_name: string;
  district_name: string;
  fin_year: string;
  total_expenditure: string;
  total_households_worked: string;
  total_persondays_generated: string;
  total_women_persondays: string;
  total_sc_persondays: string;
  total_st_persondays: string;
  total_works_completed: string;
  total_works_ongoing: string;
  avg_days_employment_provided: string;
  total_payment_made: string;
  avg_wage_rate: string;
  last_updated: string;
  total_records: string;
}

export interface DBStats {
  total_records: string;
  total_states: string;
  total_districts: string;
  total_years: string;
  last_updated: string | null;
  first_record: string | null;
  total_expenditure_all: string | null;
  total_households_all: string | null;
}

export interface SyncStatus {
  id: number;
  sync_type: string;
  state_name: string | null;
  fin_year: string | null;
  status: string;
  records_synced: number;
  error_message: string | null;
  started_at: string;
  completed_at: string;
  created_at: string;
}

// API Methods
export const apiService = {
  // Get all states
  async getStates(): Promise<State[]> {
    console.log('🎯 getStates() called');
    const { data } = await api.get('/states');
    console.log('📍 States response:', data);
    return data.data;
  },

  // Get districts by state
  async getDistricts(stateName: string): Promise<District[]> {
    const { data } = await api.get(`/districts/${encodeURIComponent(stateName)}`);
    return data.data;
  },

  // Get performance data for a district
  async getPerformance(districtName: string, year?: string): Promise<PerformanceData[]> {
    const params = year ? { year } : {};
    const { data } = await api.get(`/performance/${encodeURIComponent(districtName)}`, { params });
    return data.data;
  },

  // Get database statistics
  async getStats(): Promise<DBStats> {
    console.log('🎯 getStats() called');
    const { data } = await api.get('/admin/stats');
    console.log('📊 Stats response:', data);
    return data.data;
  },

  // Get sync status
  async getSyncStatus(limit: number = 10): Promise<SyncStatus[]> {
    const { data } = await api.get('/admin/sync-status', { params: { limit } });
    return data.data;
  },

  // Trigger manual sync
  async triggerSync(state?: string, year?: string): Promise<any> {
    const params: any = {};
    if (state) params.state = state;
    if (year) params.year = year;
    const { data } = await api.post('/admin/sync', null, { params });
    return data;
  },

  // Health check
  async healthCheck(): Promise<any> {
    const { data } = await api.get('/health');
    return data;
  },
};

export default apiService;
