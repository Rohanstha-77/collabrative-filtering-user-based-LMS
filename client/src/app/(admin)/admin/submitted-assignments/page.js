"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import assignmentService from '@/services/assignmentService';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SubmittedAssignmentsPage = () => {
  const { auth } = useContext(AuthContext);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [grades, setGrades] = useState({});
  const [loadingActions, setLoadingActions] = useState({});
  const [showRejectionReasonInputFor, setShowRejectionReasonInputFor] = useState(null); // New state to control visibility

  useEffect(() => {
    if (auth?.accessToken) {
      
      fetchAllSubmittedAssignments();
    } else {
      
    }
  }, [auth?.accessToken]);

  const fetchAllSubmittedAssignments = async () => {
    try {
      const data = await assignmentService.getAllSubmittedAssignments(auth.accessToken);

      

      if (Array.isArray(data)) {
        setSubmittedAssignments(data);
        

        const initialRejectionReasons = {};
        const initialGrades = {};

        data.forEach((assignment) => {
          assignment.submissions.forEach((sub) => {
            initialRejectionReasons[sub._id] = sub.rejectionReason || '';
            initialGrades[sub._id] = sub.grade || '';
          });
        });

        setRejectionReasons(initialRejectionReasons);
        setGrades(initialGrades);
      } else {
        toast.error("Failed to fetch submitted assignments: Invalid data format.");
      }
    } catch (err) {
      console.error("❌ Error while fetching assignments:", err);
      toast.error("Something went wrong while fetching assignments.");
    }
  };

  // Watcher for state update confirmation
  

  const handleRejectionReasonChange = (submissionId, value) => {
    setRejectionReasons((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const handleGradeChange = (submissionId, value) => {
    setGrades((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const setLoading = (submissionId, value) => {
    setLoadingActions((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const handleReviewSubmission = async (assignmentId, submissionId, status) => {
    if (status === 'rejected' && showRejectionReasonInputFor !== submissionId) {
      setShowRejectionReasonInputFor(submissionId);
      return; // Don't send API call yet, wait for user to input reason
    }

    const reason = status === 'rejected' ? rejectionReasons[submissionId]?.trim() : '';

    if (status === 'rejected' && !reason) {
      toast.warning('Rejection reason is required.');
      return;
    }

    setLoading(submissionId, true);
    const response = await assignmentService.reviewSubmission(
      assignmentId,
      submissionId,
      status,
      reason,
      auth.accessToken
    );
    setLoading(submissionId, false);

    if (response.success) {
      toast.success(`Submission ${status} successfully!`);
      setShowRejectionReasonInputFor(null); // Hide input after successful review
      fetchAllSubmittedAssignments();
    } else {
      toast.error(response.message);
    }
  };

  const handleGradeSubmission = async (assignmentId, submissionId) => {
    const grade = grades[submissionId]?.trim();

    if (!grade) {
      toast.warning('Grade cannot be empty.');
      return;
    }

    setLoading(submissionId, true);
    const response = await assignmentService.gradeSubmission(
      assignmentId,
      submissionId,
      grade,
      auth.accessToken
    );
    setLoading(submissionId, false);

    if (response.success) {
      toast.success('Submission graded successfully!');
      fetchAllSubmittedAssignments();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Submitted Assignments</h1>

      {submittedAssignments.length === 0 ? (
        <p>No submitted assignments found.</p>
      ) : (
        <div className="space-y-6">
          {submittedAssignments.map((assignment) => (
            <Card key={assignment._id}>
              <CardHeader>
                <CardTitle>
                  {assignment.title} (Course: {assignment.courseId.title})
                </CardTitle>
                <p className="text-sm text-gray-600">{assignment.description}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">Submissions:</h3>
                {assignment.submissions.length === 0 ? (
                  <p>No submissions for this assignment.</p>
                ) : (
                  <ul className="space-y-4">
                    {assignment.submissions.map((submission) => (
                      <li
                        key={submission._id}
                        className="p-3 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          <h4 className="font-medium">
                            Student: {submission.studentId?.username || 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-blue-600">
                            File:{' '}
                            <a
                              href={`http://localhost:8080/${submission.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              View Submission
                            </a>
                          </p>
                          <p className="text-sm">
                            Status:{' '}
                            <span
                              className={`font-semibold ${
                                submission.status === 'approved'
                                  ? 'text-green-600'
                                  : submission.status === 'rejected'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {submission.status}
                            </span>
                          </p>
                          {submission.status === 'rejected' && submission.rejectionReason && (
                            <p className="text-sm text-red-500">
                              Reason: {submission.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2 mt-2 md:mt-0">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`grade-${submission._id}`} className="sr-only">
                              Grade
                            </Label>
                            <Input
                              id={`grade-${submission._id}`}
                              type="text"
                              placeholder="Grade"
                              value={grades[submission._id] || ''}
                              onChange={(e) =>
                                handleGradeChange(submission._id, e.target.value)
                              }
                              className="w-24"
                            />
                            <Button
                              onClick={() =>
                                handleGradeSubmission(assignment._id, submission._id)
                              }
                              size="sm"
                              disabled={loadingActions[submission._id]}
                            >
                              {loadingActions[submission._id] ? 'Saving...' : 'Save Grade'}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            {submission.status !== 'approved' && (
                              <Button
                                onClick={() =>
                                  handleReviewSubmission(
                                    assignment._id,
                                    submission._id,
                                    'approved'
                                  )
                                }
                                size="sm"
                                variant="success"
                                disabled={loadingActions[submission._id]}
                              >
                                {loadingActions[submission._id] ? 'Processing...' : 'Approve'}
                              </Button>
                            )}
                            {submission.status !== 'rejected' && (
                              <Button
                                onClick={() =>
                                  handleReviewSubmission(
                                    assignment._id,
                                    submission._id,
                                    'rejected'
                                  )
                                }
                                size="sm"
                                variant="destructive"
                                disabled={loadingActions[submission._id]}
                              >
                                {loadingActions[submission._id] ? 'Processing...' : 'Reject'}
                              </Button>
                            )}
                          </div>
                          {showRejectionReasonInputFor === submission._id && (
                            <div className="flex flex-col space-y-2 mt-2">
                              <Textarea
                                placeholder="Rejection Reason"
                                value={rejectionReasons[submission._id]}
                                onChange={(e) =>
                                  handleRejectionReasonChange(submission._id, e.target.value)
                                }
                                className="mt-2"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    handleReviewSubmission(
                                      assignment._id,
                                      submission._id,
                                      'rejected'
                                    )
                                  }
                                  size="sm"
                                  disabled={loadingActions[submission._id]}
                                >
                                  {loadingActions[submission._id] ? 'Confirming...' : 'Confirm Reject'}
                                </Button>
                                <Button
                                  onClick={() => setShowRejectionReasonInputFor(null)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignmentsPage;
