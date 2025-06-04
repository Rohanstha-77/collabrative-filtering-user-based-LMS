import axiosInstance from "@/api/axiosInstance"

export const registerService = async(formData) => {
   const {data} = await axiosInstance.post('/auth/register',{...formData, role:'user'})
   return data

}
export const loginService = async(formData) => {
   const {data} = await axiosInstance.post('/auth/login',{formData})
   return data

}

export const checkAuth = async() => {
   const {data} = await axiosInstance.get('/auth/checkauth')
   // console.log(data)
   return data

}
export const mediaUploadService = async(formData, onProgressCallback) => {
   const {data} = await axiosInstance.post('/media/upload',formData, {onUploadProgress: ((progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100)/progressEvent.total)
      onProgressCallback(percentCompleted)
   })})
   // console.log(data)
   return data

}
export const mediaDeleteService = async(id) => {
   const {data} = await axiosInstance.delete(`/media/delete/${id}`)

   return data
}
export const adminCourseListService = async() => {
   const {data} = await axiosInstance.get("/admin/course/get")

   return data
}
export const addCourseService = async(formData) => {
   const {data} = await axiosInstance.post("/admin/course/add",formData)

   return data
}
export const adminCourseDetailService = async(id) => {
   const {data} = await axiosInstance.get(`/admin/course/get/details/${id}`)

   return data
}
export const UpdateCourseService = async(id,formData) => {
   const {data} = await axiosInstance.put(`/admin/course/update/${id}`,formData)
   
   return data

}
export const courseDeleteService = async(id) => {
   const  {data}= await axiosInstance.delete(`admin/course/delete/${id}`)
   return data
}
export const bulkUploadService = async(formData, onProgressCallback) => {
   const {data} = await axiosInstance.post('/media/bulkupload',formData, {onUploadProgress: ((progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100)/progressEvent.total)
      onProgressCallback(percentCompleted)
   })})
   // console.log(data)
   return data
}

export const studentCourseListService = async(query) => {
   const {data} = await axiosInstance.get(`/student/course/get?${query}`)

   return data
}

export const studentCourseDetailService = async(id, userId) => {
   const {data} = await axiosInstance.get(`/student/course/get/details/${id}/${userId}`)

   return data
}

export const postEnrollCouseService = async(formData) => {
   const {data} = await axiosInstance.post("/student/enrollCourses/post", formData)
   return data
}

export const studentEnrollCoursesService = async(id) => {
   const {data} = await axiosInstance.get(`/student/enrollcourses/get/${id}`)
   return data
}

export const studentCourseProgressService = async(userId, courseId) => {
   const {data} = await axiosInstance.get(`/student/courseprogress/get/${userId}/${courseId}`)
   
   return {data}
}

export const markCourseProgressService = async(userId, courseId, lectureId) => {
   const {data} = await axiosInstance.post(`/student/courseprogress/mark-lecture`,{
      userId, courseId, lectureId
   })
   
   return {data}
}
export const resetCourseProgressService = async(userId, courseId) => {
   const {data} = await axiosInstance.post(`/student/courseprogress/reset-progress`,{
      userId, courseId
   })
   
   return {data}
}

export const postRatingService = async(courseId, userId, rate) => {
   const {data} = await axiosInstance.post("/recommendation/postrating", {courseId, userId, rate})
   return data
}

export const getRatingService = async(courseId, userId) => {
   const {data} = await axiosInstance.get(`/recommendation/getrating/${courseId}/${userId}`)

   return data
}

export const getRecommendationService = async(userId) => {
   const {data} = await axiosInstance.get(`/recommendation/getrecommendation/${userId}`)

   return data
}