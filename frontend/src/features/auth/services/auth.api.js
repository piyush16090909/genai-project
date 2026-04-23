import api from "../../../services/apiClient.js"

export async function register({ username, email, password }) {
    const response = await api.post('/api/auth/register', {
        username, email, password
    })

    return response.data

}

export async function login({ email, password, identifier }) {
    const response = await api.post("/api/auth/login", {
        email,
        identifier: identifier || email,
        password
    })

    return response.data

}

export async function logout() {
    const response = await api.get("/api/auth/logout")

    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")

    return response.data

}
