import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  submissions: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      submissionDate: {
        type: Date,
        default: Date.now,
      },
      fileUrl: {
        type: String, // URL to the submitted file
      },
      grade: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      rejectionReason: {
        type: String,
      },
    },
  ],
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
