import axios from 'axios';

// The API URL is worked out at RUNTIME, based on whatever host the page is
// actually being viewed from - not baked in permanently at build time.
//
// Why this matters: a React app's JS files are static and get served to
// whoever opens the page. If we hardcoded "http://localhost:8080/api" into
// the build, that would only ever work on the machine that built it. The
// same Docker image needs to work whether it's opened via localhost (local
// dev), an EC2 public IP, or a real domain later - so instead we ask the
// browser "what host did you load this page from?" and talk to the backend
// on that same host, port 8080.
//
// You can still override this explicitly if needed by setting
// REACT_APP_API_URL at build time (e.g. for a setup where the API lives on
// a totally different domain than the frontend).
function resolveApiBaseUrl() {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:8080/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT token (if we have one) to every outgoing request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says "your token is invalid/expired", log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
