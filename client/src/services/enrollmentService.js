import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Replace with your backend URL

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getEnrolledCourses = async (userId) => {
  const response = await axios.get(
    `${API_URL}/student/enrollcourses/get/${userId}`,
    getAuthHeaders()
  );
  return response.data;
};
