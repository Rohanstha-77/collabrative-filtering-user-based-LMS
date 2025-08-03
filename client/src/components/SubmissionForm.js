import React, { useState } from 'react';

const SubmissionForm = ({ assignmentId, onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assignmentId, file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubmissionForm;
