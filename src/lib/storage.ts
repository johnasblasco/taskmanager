export const saveToken = (token: string) =>
    localStorage.setItem("token", token);

export const getToken = () =>
    localStorage.getItem("token");

export const removeToken = () =>
    localStorage.removeItem("token");




export const saveUser = (token: string) =>
    localStorage.setItem("user", token);

export const getUser = () => {
    const raw = localStorage.getItem("user");
    try {
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null; // in case storage gets corrupted
    }
};
export const removeUser = () =>
    localStorage.removeItem("user");


// HOW TO USE !
// 1. import { saveToken, getToken, removeToken } from "./storage";
// 2. saveToken("my-jwt-token");
// 3. getToken();
// 4. removeToken();