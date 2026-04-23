import axios from "axios"

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "https://genai-project-1-xocy.onrender.com").replace(/\/+$/, "")

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

export default api
