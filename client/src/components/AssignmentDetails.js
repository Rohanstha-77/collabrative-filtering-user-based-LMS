"use client"
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth-context/index.js';
import SubmissionForm from './SubmissionForm';
import assignmentService from '../services/assignmentService';
import { Button } from './ui/button.jsx';
import axios from 'axios';

const AssignmentDetails = ({ assignment, courseProgress }) => {
  console.log("AssignmentDetails - courseProgress:", courseProgress);
  const { auth } = useContext(AuthContext);
  const [studentSubmission, setStudentSubmission] = useState(null);

  useEffect(() => {
    if (assignment && auth?.user?._id) {
      const submission = assignment.submissions.find(
        (sub) => sub.studentId === auth.user._id
      );
      setStudentSubmission(submission);
    }
  }, [assignment, auth?.user?._id]);

  const handleSubmit = async (assignmentId, file) => {
    try {
      const response = await assignmentService.submitAssignment(assignmentId, file, auth.accessToken);
      if (response.success) {
        alert('Assignment submitted successfully!');
        // Optionally, re-fetch assignments or update local state to reflect new submission
      } else {
        alert('Failed to submit assignment: ' + response.message);
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('An error occurred while submitting assignment.');
    }
  };

  return (
    <div>
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>

      {studentSubmission ? (
        <div>
          <h3 className="font-semibold mt-4">Your Submission:</h3>
          <p>Status: <span className={`font-bold ${studentSubmission.status === 'approved' ? 'text-green-600' : studentSubmission.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{studentSubmission.status}</span></p>
          {studentSubmission.grade && <p>Grade: {studentSubmission.grade}</p>}
          {studentSubmission.rejectionReason && (
            <p className="text-red-500">Reason for Rejection: {studentSubmission.rejectionReason}</p>
          )}
          <p>Submitted on: {new Date(studentSubmission.submissionDate).toLocaleDateString()}</p>
          <p>File: <a href={`http://localhost:8080/${studentSubmission.fileUrl}`} target="_blank" rel="noopener noreferrer">View Submitted File</a></p>
          {studentSubmission.status === 'approved' && studentSubmission.fileUrl && (
            <p className="mt-2">
              <a
                href={`http://localhost:8080/${studentSubmission.fileUrl}`}
                download
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download Approved Assignment
              </a>
            </p>
          )}
          {courseProgress?.completed && courseProgress?.certificateUrl && (
            <p className="mt-2">
              <Button
                onClick={async () => {
                  try {
                    const response = await axios.get(`http://localhost:8080${courseProgress.certificateUrl}`, {
                      headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                      },
                      responseType: 'blob', // Important for downloading files
                    });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `certificate-${auth.user._id}-${assignment.courseId}.pdf`); // Dynamic filename
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                  } catch (error) {
                    console.error('Error downloading certificate:', error);
                    alert('Failed to download certificate.');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Certificate
              </Button>
            </p>
          )}
        </div>
      ) : (
        <SubmissionForm assignmentId={assignment._id} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default AssignmentDetails;
