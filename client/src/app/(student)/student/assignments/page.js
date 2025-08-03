"use client";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/auth-context';
import { getEnrolledCourses } from '../../../../services/enrollmentService';
import assignmentService from '../../../../services/assignmentService';
import { studentCourseProgressService } from '../../../../services';
import AssignmentDetails from '../../../../components/AssignmentDetails';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssignmentPage = () => {
  const { auth } = useContext(AuthContext);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [courseProgressData, setCourseProgressData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Fetch enrolled courses on mount
  useEffect(() => {
    const fetchCompletedCourses = async () => {
      console.log("Auth user ID:", auth?.user?._id);
      if (!auth?.user?._id) {
        setLoadingCourses(false);
        console.log("No auth user ID, skipping course fetch.");
        return;
      }
      try {
        setError(null);
        setLoadingCourses(true);
        const response = await getEnrolledCourses(auth.user._id);
        console.log("Fetched completed courses response:", response);
        if (response.success) {
          const filteredCourses = response.data.filter(
            (course) => course.completed
          );
          setCompletedCourses(filteredCourses);
          console.log("Filtered completed courses:", filteredCourses);
          if (filteredCourses.length === 0) {
              setError("You have not completed any courses yet. Complete a course to see assignments.");
          }
        } else {
          setError("Failed to fetch your courses.");
        }
      } catch (err) {
        setError("An error occurred while fetching your courses.");
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCompletedCourses();
  }, [auth?.user?._id]);

  // Fetch assignments when a course is selected
  useEffect(() => {
    const fetchAssignmentsAndProgress = async () => {
      console.log("Selected course:", selectedCourse);
      if (!selectedCourse) return;
      try {
        setError(null);
        setLoadingAssignments(true);
        setAssignments([]); // Clear previous assignments
        setCourseProgressData(null); // Clear previous course progress

        // Fetch assignments
        const assignmentsData = await assignmentService.getStudentAssignmentsByCourse(selectedCourse.courseId, auth.accessToken);
        console.log("Fetched assignments data:", assignmentsData);
        setAssignments(assignmentsData);

        // Fetch course progress
        const progressResponse = await studentCourseProgressService(auth.user._id, selectedCourse.courseId);
        console.log("Fetched course progress response:", progressResponse);
        if (progressResponse?.data?.success) {
          setCourseProgressData(progressResponse.data.data);
          console.log("Course Progress Data:", progressResponse.data.data);
        }

      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while fetching assignments or course progress.');
        }
        console.error('Error fetching assignments or course progress:', err);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignmentsAndProgress();
  }, [selectedCourse, auth?.user?._id]);

  const handleCourseSelection = (course) => {
      setSelectedCourse(course);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      
      {loadingCourses ? (
        <p>Loading your completed courses...</p>
      ) : error ? (
         <p className="text-red-500">{error}</p>
      ) : (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Select a Completed Course</h2>
            <div className="flex flex-wrap gap-4">
                {completedCourses.map((course) => (
                    <Button 
                        key={course.courseId}
                        onClick={() => handleCourseSelection(course)}
                        variant={selectedCourse?.courseId === course.courseId ? "default" : "outline"}
                    >
                        {course.title}
                    </Button>
                ))}
            </div>
        </div>
      )}

      {selectedCourse && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assignments for {selectedCourse.title}</h2>
          {loadingAssignments ? (
            <p>Loading assignments...</p>
          ) : assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment._id}>
                    <CardHeader>
                        <CardTitle>{assignment.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AssignmentDetails assignment={assignment} courseProgress={courseProgressData} />
                    </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No assignments found for this course.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
