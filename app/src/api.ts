// API Service for Žvaigždžių Namai
// Use same domain for API - backend runs on port 3001 behind nginx proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zvaigzdziunamai.lt/api';

// Helper for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string, phone?: string) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    }),
  
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  getMe: () => fetchAPI('/auth/me'),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) =>
    fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMyBookings: () => fetchAPI('/bookings/my'),
  
  getBooking: (id: string) => fetchAPI(`/bookings/${id}`),
};

// Admin API
export const adminAPI = {
  getStats: () => fetchAPI('/admin/stats'),
  
  getBookings: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return fetchAPI(`/admin/bookings?${queryParams.toString()}`);
  },
  
  updateBooking: (id: string, data: any) =>
    fetchAPI(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Accommodations & Activities API
export const publicAPI = {
  getAccommodations: () => fetchAPI('/accommodations'),
  getActivities: () => fetchAPI('/activities'),
  getHealth: () => fetchAPI('/health'),
};

// Payment API
export const paymentAPI = {
  createIntent: (bookingId: string, amount: number) =>
    fetchAPI('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, amount }),
    }),
};
