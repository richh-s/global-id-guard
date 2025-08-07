// src/lib/api.ts
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
axios.defaults.baseURL = baseURL
