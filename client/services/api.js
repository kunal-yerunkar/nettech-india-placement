
import axios from 'axios';

import { API_BASE_URL } from "../constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // --- Public Content Hub ---
  getStudents: async () => (await axios.get(`${BASE_URL}/records/nt_students`)).data,
  getPartners: async () => (await axios.get(`${BASE_URL}/records/nt_partners`)).data,
  getReels: async () => (await axios.get(`${BASE_URL}/records/nt_reels`)).data,
  getDomains: async () => (await axios.get(`${BASE_URL}/records/nt_domains`)).data,
  getProcessSteps: async () => (await axios.get(`${BASE_URL}/content/nt_content_process`)).data,
  getFaqs: async () => (await axios.get(`${BASE_URL}/content/nt_content_faqs`)).data,
  getWhyChooseUs: async () => (await axios.get(`${BASE_URL}/content/nt_content_why_choose`)).data,
  getChallenges: async () => (await axios.get(`${BASE_URL}/content/nt_content_challenges`)).data,
  getPartnerBenefits: async () => (await axios.get(`${BASE_URL}/content/nt_content_partner_benefits`)).data,
  getStateCityData: async () => (await axios.get(`${BASE_URL}/content/nt_geo_data`)).data,
  getDomainClusters: async () => (await axios.get(`${BASE_URL}/content/nt_domain_clusters`)).data,

  getFormSchema: async (type = 'student') => (await axios.get(`${BASE_URL}/schemas/${type}`)).data,

  // --- Admin Matrix ---
  getStudentLeads: async () => (await apiClient.get('/admin/leads/student')).data,
  getPartnerLeads: async () => (await apiClient.get('/admin/leads/partner')).data,
  getInquiries: async () => (await apiClient.get('/admin/leads/inquiry')).data,

  // --- Persistence ---
  saveRecord: async (key, item) => (await apiClient.post(`/admin/records/${key}`, item)).data,
  deleteRecord: async (key, id) => (await apiClient.delete(`/admin/records/${key}/${id}`)).data,
  saveFormSchema: async (type, schema) => (await apiClient.post(`/admin/schemas/${type}`, schema)).data,

  // --- Submissions ---
  registerStudent: async (data) => {
    try {
      return (await axios.post(`${BASE_URL}/leads/student`, data)).data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Uplink synchronization failed.');
    }
  },
  registerPartner: async (data) => (await axios.post(`${BASE_URL}/leads/partner`, data)).data,
  submitInquiry: async (data) => (await axios.post(`${BASE_URL}/leads/inquiry`, data)).data,

  // --- Auth ---
  adminLogin: async (creds) => {
    try {
      return (await axios.post(`${BASE_URL}/auth/login`, creds)).data;
    } catch (err) {
      return null;
    }
  }
};
