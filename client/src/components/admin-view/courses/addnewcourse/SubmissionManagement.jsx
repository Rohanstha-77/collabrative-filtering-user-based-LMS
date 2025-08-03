import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { AuthContext } from '@/context/auth-context';
import { useContext, useEffect, useState } from 'react';
import assignmentService from '@/services/assignmentService';

const SubmissionManagement = ({ assignmentId, onClose }) => {
  const { auth } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    const response = await assignmentService.getAssignmentSubmissions(assignmentId, auth.accessToken);
    if (response.success) {
      setSubmissions(response.data);
      const initialGrades = {};
      const initialRejectionReasons = {};
      response.data.forEach(sub => {
        initialGrades[sub._id] = sub.grade || '';
        initialRejectionReasons[sub._id] = sub.rejectionReason || '';
      });
      setGrades(initialGrades);
      setRejectionReasons(initialRejectionReasons);
    } else {
      toast.error(response.message);
    }
  };

  const handleGradeChange = (submissionId, value) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [submissionId]: value,
    }));
  };

  const handleRejectionReasonChange = (submissionId, value) => {
    setRejectionReasons(prevReasons => ({
      ...prevReasons,
      [submissionId]: value,
    }));
  };

  const handleGradeSubmission = async (submissionId) => {
    const grade = grades[submissionId];
    const response = await assignmentService.gradeSubmission(assignmentId, submissionId, grade, auth.accessToken);
    if (response.success) {
      toast.success('Submission graded successfully!');
      fetchSubmissions(); // Refresh submissions to show updated grade
    } else {
      toast.error(response.message);
    }
  };

  const handleReviewSubmission = async (submissionId, status) => {
    const reason = status === 'rejected' ? rejectionReasons[submissionId] : '';
    const response = await assignmentService.reviewSubmission(assignmentId, submissionId, status, reason, auth.accessToken);
    if (response.success) {
      toast.success(`Submission ${status} successfully!`);
      fetchSubmissions();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Submissions for Assignment</h2>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      {submissions.length === 0 ? (
        <p>No submissions for this assignment yet.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission._id} className="p-3 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h4 className="font-medium">Student: {submission.studentId?.username || 'N/A'}</h4>
                <p className="text-sm text-gray-600">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                <p className="text-sm text-blue-600">File: <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">View Submission</a></p>
                <p className="text-sm">Status: <span className={`font-semibold ${submission.status === 'approved' ? 'text-green-600' : submission.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{submission.status}</span></p>
                {submission.status === 'rejected' && submission.rejectionReason && (
                  <p className="text-sm text-red-500">Reason: {submission.rejectionReason}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 mt-2 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`grade-${submission._id}`} className="sr-only">Grade</Label>
                  <Input
                    id={`grade-${submission._id}`}
                    type="text"
                    placeholder="Grade"
                    value={grades[submission._id]}
                    onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={() => handleGradeSubmission(submission._id)} size="sm">Grade</Button>
                </div>
                <div className="flex items-center space-x-2">
                  {submission.status !== 'approved' && (
                    <Button onClick={() => handleReviewSubmission(submission._id, 'approved')} size="sm" variant="success">Approve</Button>
                  )}
                  {submission.status !== 'rejected' && (
                    <Button onClick={() => handleReviewSubmission(submission._id, 'rejected')} size="sm" variant="destructive">Reject</Button>
                  )}
                </div>
                {submission.status === 'rejected' && (
                  <Input
                    type="text"
                    placeholder="Rejection Reason"
                    value={rejectionReasons[submission._id]}
                    onChange={(e) => handleRejectionReasonChange(submission._id, e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmissionManagement;
