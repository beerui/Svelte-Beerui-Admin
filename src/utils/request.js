import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from "./config";
import { loginOut } from "./login.js";
import { TOKEN } from "../lib/stores.js";
import { showDebounceNotice } from "./index.js";
import { get_store_value } from "svelte/internal";

// create an axios instance
const service = axios.create({
    baseURL: baseUrl,
    withCredentials: false,
    timeout: 600000
})
service.interceptors.request.use((config) => {
    if (getToken()) {
        config.headers.token = get_store_value(TOKEN)
    }
    return config
}, (error) => {
    // model.set({ delay: 3000, show: true, message: error })
    return Promise.reject(error)
})

service.interceptors.response.use(
    (response) => {
        const res = response.data
        if (res.code !== 20000) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50001 || res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                loginOut('loginOut 登录失效')
            }
            showDebounceNotice(res)
            return Promise.reject(res.message || 'Error')
        }
        return res.data
    },
    (error) => {
        showDebounceNotice({ message: error, type: 'error' })
        return Promise.reject(error)
    }
)

export default service
