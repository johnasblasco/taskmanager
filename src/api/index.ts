import axios from "axios";
import { getToken } from "@/lib/storage";

const instance = axios.create({
    baseURL: "https://api-queue.slarenasitsolutions.com/public/api",
});


// Add a request interceptor to include the token in headers
instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;




//HOW TO USE !
// 1. import axios from "./index"; // <- actually imports "instance" from index.ts

// 2. axios.get("/users"); // uses baseURL + token from our custom instance
