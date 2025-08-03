import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { AuthContext } from '@/context/auth-context';
import { useContext, useEffect, useState } from 'react';
import assignmentService from '@/services/assignmentService';
import SubmissionManagement from './SubmissionManagement';

const AssignmentManagement = ({ courseId }) => {
  const { auth } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState(null); // New state for managing submission view

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    const response = await assignmentService.getAssignmentsByCourse(courseId, auth.accessToken);
    if (response.success) {
      setAssignments(response.data);
    } else {
      toast.error(response.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleCreateAssignment = async () => {
    const data = { ...newAssignment, courseId };
    const response = await assignmentService.createAssignment(data, auth.accessToken);
    if (response.success) {
      toast.success('Assignment created successfully!');
      setNewAssignment({ title: '', description: '', dueDate: '' });
      fetchAssignments();
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateAssignment = async () => {
    const response = await assignmentService.updateAssignment(editingAssignment._id, newAssignment, auth.accessToken);
    if (response.success) {
      toast.success('Assignment updated successfully!');
      setEditingAssignment(null);
      setNewAssignment({ title: '', description: '', dueDate: '' });
      fetchAssignments();
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    const response = await assignmentService.deleteAssignment(assignmentId, auth.accessToken);
    if (response.success) {
      toast.success('Assignment deleted successfully!');
      fetchAssignments();
    } else {
      toast.error(response.message);
    }
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({ title: assignment.title, description: assignment.description, dueDate: assignment.dueDate.split('T')[0] }); // Format date for input
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assignment Management</h2>

      {/* Create/Edit Assignment Form */}
      <div className="p-4 border rounded-md shadow-sm">
        <h3 className="text-xl font-semibold mb-4">{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={newAssignment.title}
              onChange={handleInputChange}
              placeholder="Assignment Title"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={newAssignment.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newAssignment.description}
              onChange={handleInputChange}
              placeholder="Assignment Description"
            />
          </div>
        </div>
        <Button onClick={editingAssignment ? handleUpdateAssignment : handleCreateAssignment} className="mt-4">
          {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
        </Button>
        {editingAssignment && (
          <Button onClick={() => { setEditingAssignment(null); setNewAssignment({ title: '', description: '', dueDate: '' }); }} variant="outline" className="mt-4 ml-2">
            Cancel
          </Button>
        )}
      </div>

      {/* Assignment List */}
      <div className="p-4 border rounded-md shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Existing Assignments</h3>
        {assignments.length === 0 ? (
          <p>No assignments found for this course.</p>
        ) : (
          <ul className="space-y-3">
            {assignments.map((assignment) => (
              <li key={assignment._id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => handleEditClick(assignment)} variant="outline" size="sm">Edit</Button>
                  <Button onClick={() => handleDeleteAssignment(assignment._id)} variant="destructive" size="sm">Delete</Button>
                  <Button onClick={() => setViewingSubmissionsFor(assignment._id)} variant="outline" size="sm">View Submissions</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {viewingSubmissionsFor && (
        <SubmissionManagement
          assignmentId={viewingSubmissionsFor}
          onClose={() => setViewingSubmissionsFor(null)}
        />
      )}
    </div>
  );
};

export default AssignmentManagement;
