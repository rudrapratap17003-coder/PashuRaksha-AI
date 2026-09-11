import axios from 'axios'

// Determine API base URL dynamically based on environment configuration
let rawBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
if (rawBaseUrl) {
  rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '')
  if (!rawBaseUrl.endsWith('/api/v1') && !rawBaseUrl.endsWith('/api')) {
    rawBaseUrl = `${rawBaseUrl}/api/v1`
  }
}

const API_BASE_URL = rawBaseUrl || (import.meta.env.PROD ? '/api/v1' : 'http://127.0.0.1:8000/api/v1')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pashuraksha_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Uniform error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('pashuraksha_token')
      localStorage.removeItem('pashuraksha_user')
    }
    return Promise.reject(error)
  }
)

export const checkHealth = async () => {
  const response = await apiClient.get('/health')
  return response.data
}

export default apiClient
