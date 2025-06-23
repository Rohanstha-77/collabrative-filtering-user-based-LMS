"use client";
import Header from "@/components/student-view/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { studentEnrollCoursesService } from "@/services";
import { WatchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

const MyCourses = () => {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const { studentEnrollCourse, setStudentEnrollCourse } =
    useContext(StudentContext);
  // console.log(studentEnrollCourse)
  const studentEnrollCourses = async () => {
    if (!auth?.user?._id) return;
    try {
      const response = await studentEnrollCoursesService(auth?.user?._id);
      if (response?.success) setStudentEnrollCourse(response?.data);
      // console.log(auth?.user?._id)
    } catch (error) {
      if (error?.response?.status === 404) console.log("no Course found");
      console.error("Failed to fetch enrolled courses:", error);
    }
  };

  useEffect(() => {
    studentEnrollCourses();
  }, [auth?.user?._id]);
  return (
    <>
      <Header />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8 text-[#4F46E5]">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {studentEnrollCourse && studentEnrollCourse.length > 0 ? (
            studentEnrollCourse.map((item) => (
              <Card key={item._id} className="flex flex-col">
                <CardContent className="p-4 flex-grow">
                  {/* Course Image */}
                  <div className="w-full h-[180px] overflow-hidden rounded-md">
                    <Image
                      src={item?.image}
                      alt="course image"
                      width={500}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course Title */}
                  <h3 className="font-bold mt-6">{item?.title}</h3>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Progress</span>
                      <span className="text-blue-600 font-medium">
                        {item?.completionPercentage ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item?.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() =>
                      router.push(`/student/course-progress/${item?.courseId}`)
                    }
                    className="flex-1 cursor-pointer"
                  >
                    <WatchIcon className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <h1 className="text-4xl font-bold">No course found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
