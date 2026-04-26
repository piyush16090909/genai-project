import axios from "axios"

const configuredApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim()
const defaultApiBaseUrl = import.meta.env.DEV
    ? ""
    : "https://genai-project-1-xocy.onrender.com"

const apiBaseUrl = (configuredApiBaseUrl || defaultApiBaseUrl).replace(/\/+$/, "")

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

export default api
