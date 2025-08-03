import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const assignmentService = {
  createAssignment: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/admin/assignment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  updateAssignment: async (assignmentId, data, token) => {
    try {
      const response = await axios.put(`${API_URL}/admin/assignment/${assignmentId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  deleteAssignment: async (assignmentId, token) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/assignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  getAssignmentsByCourse: async (courseId, token) => {
    try {
      const response = await axios.get(`${API_URL}/admin/assignment/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  getStudentAssignmentsByCourse: async (courseId, token) => {
    try {
      const response = await axios.get(`${API_URL}/student/assignment/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  getAssignmentSubmissions: async (assignmentId, token) => {
    try {
      const response = await axios.get(`${API_URL}/admin/assignment/${assignmentId}/submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  gradeSubmission: async (assignmentId, submissionId, grade, token) => {
    try {
      const response = await axios.put(`${API_URL}/admin/assignment/${assignmentId}/submissions/${submissionId}`, { grade }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  submitAssignment: async (assignmentId, file, token) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/student/assignment/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  reviewSubmission: async (assignmentId, submissionId, status, rejectionReason, token) => {
    try {
      const response = await axios.put(`${API_URL}/admin/assignment/${assignmentId}/submissions/${submissionId}/review`, { status, rejectionReason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },

  getAllSubmittedAssignments: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/admin/assignment/submitted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : { success: false, message: error.message };
    }
  },
};

export default assignmentService;