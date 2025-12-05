import axios from '@/api/index';

export const login = async (username: string, password: string) => {
    const response = await axios.post('/login', { username, password })
    return response.data
}

export const logout = async () => {
    const response = await axios.post('/logout')
    return response.data
}

//HOW TO USE !
// 1. import { login, logout } from "./AuthApi";
// 2. const res = await login(username, password);
