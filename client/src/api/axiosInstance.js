import axios from "axios";


const axiosInstance = axios.create({
    baseURL: 'https://collabrative-filtering-user-based-lms.onrender.com/',

})

axiosInstance.interceptors.request.use(config => {
    const token = (sessionStorage.getItem('accessToken')|| "")
    // console.log(token)

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
},(err) => Promise.reject(err))

export default axiosInstance

