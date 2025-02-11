import axios from 'axios';
import { getProfile } from '../provider/line';
// ดึง token จาก localStorage หรือที่เก็บอื่นๆ

const api = axios.create({
    baseURL: '', // แก้เป็น URL จริง
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✨ Interceptor: ใส่ token ทุกครั้งที่มี request
api.interceptors.request.use(async (config) => {
    const { userId }: any = await getProfile();

    if (userId) {
        config.headers.Authorization = `Bearer ${userId}`;
    }
    return config;
}, (error) => Promise.reject(error));

// ✨ Interceptor: ตรวจจับ 401 แล้ว refresh token
// api.interceptors.response.use((response) => response, async (error) => {
//   const originalRequest = error.config;

//   if (error.response?.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;

//     try {
//       const refreshToken = getRefreshToken();
//       const { data } = await axios.post('https://your-api.com/auth/refresh', { refreshToken });

//       // อัปเดต token ใหม่
//       localStorage.setItem('accessToken', data.accessToken);

//       // อัปเดต header และส่ง request เดิมอีกครั้ง
//       originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//       return api(originalRequest);
//     } catch (refreshError) {
//       console.error('Refresh token failed:', refreshError);
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       return Promise.reject(refreshError);
//     }
//   }

//   return Promise.reject(error);
// });

export default api;
