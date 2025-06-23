"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/videoplayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { postEnrollCouseService, studentCourseDetailService } from "@/services";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Header from "@/components/student-view/header";

const CourseDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?._id;
  // console.log(userId)

  const {
    courseDetail,
    setCourseDetail,
    currentCourseId,
    setCurrentCourseId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const [displayFreePreview, setDisplayFreePreview] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (id && id !== currentCourseId) {
      setCurrentCourseId(id);
    }
  }, [id, currentCourseId]);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await studentCourseDetailService(
          currentCourseId,
          userId
        );
        if (response?.success) {
          setCourseDetail(response.data);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoadingState(false);
      }
    };
   
    if (currentCourseId && userId) {
      fetchCourseDetail();
    }
   
  }, [currentCourseId, userId]);

  
  // console.log(courseEnrollId)
  // useEffect(() => {
  //   if (courseEnrollId) {
  //     router.push(`/student/course-progress/${courseEnrollId}`);
  //   }
  // }, [courseEnrollId, router]);

  const getFreePreviewIndex =
    courseDetail?.curriculum?.findIndex((item) => item.freePreview) ?? -1;
  const previewVideoUrl =
    getFreePreviewIndex !== -1
    ? courseDetail?.curriculum[getFreePreviewIndex]?.videoUrl
    : "";
  // console.log(previewVideoUrl)


  const handleSetFreePreview = (previewItem) => {
    if (previewItem?.videoUrl) {
      setDisplayFreePreview(previewItem.videoUrl);
      setShowDialog(true);
    }
  };

  const handleEnroll = async () => {
    if (!courseDetail || !auth?.user?._id) return;

    const formData = {
      userId: auth.user._id,
      courseId: courseDetail._id,
      title: courseDetail.title,
      adminId: courseDetail.adminId,
      adminName: courseDetail.adminName,
      image: courseDetail.image,
    };

    try {
      const response = await postEnrollCouseService(formData);
      if (response?.success) {
        router.push(`/student/course-progress/${courseDetail._id}`)
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };
  useEffect(() => {
    return () => {
      setCurrentCourseId(null);
    };
  }, []);

  if (loadingState) return <Skeleton />;
  if (!courseDetail) return <p>Error loading course details. Please try again later.</p>;

  // console.log(courseDetail);
  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-[#4F46E5] text-white p-8 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-4">{courseDetail?.title}</h1>
          <p className="text-xl mb-4">{courseDetail?.subtitle}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span>Created By {courseDetail?.adminName}</span>
            <span>Created on {courseDetail?.date?.split("T")[0]}</span>
            <span>
              {courseDetail?.students?.length}{" "}
              {courseDetail?.students?.length <= 1 ? "Student" : "Students"}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Main Content */}
          <main className="flex-grow">
            {/* What You'll Learn */}
            {courseDetail?.objectives && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What you&apos;ll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courseDetail.objectives
                      .split(".")
                      .filter((item) => item.trim() !== "")
                      .map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle color="#4F46E5" className="mr-2 h-5 w-[30px] text-green-500" />
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {courseDetail?.description && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{courseDetail.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            {courseDetail?.curriculum && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  {courseDetail.curriculum.map((item, i) => (
                    <li
                      key={i}
                      className={`${
                        item?.freePreview
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } flex items-center mb-4`}
                      onClick={() =>
                        item?.freePreview && handleSetFreePreview(item)
                      }
                    >
                      {item?.freePreview ? (
                        <PlayCircle color="#4F46E5" className="mr-2 h-4 w-4" />
                      ) : (
                        <Lock color="#4F46E5" className="mr-2 h-4 w-4" />
                      )}
                      <span>{item?.title}</span>
                    </li>
                  ))}
                </CardContent>
              </Card>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full md:w-[500px]">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                  <VideoPlayer
                    url={previewVideoUrl}
                    width="450px"
                    height="200px"
                  />
                </div>
                <Button
                  className="w-full text-xl h-full cursor-pointer"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Dialog */}
        <Dialog
          open={showDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDisplayFreePreview(null);
            }
            setShowDialog(isOpen);
          }}
        >
          <DialogContent className="w-[600px]">
            <DialogHeader>
              <DialogTitle>Course preview</DialogTitle>
            </DialogHeader>

            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
              <VideoPlayer
                url={displayFreePreview}
                width="450px"
                height="200px"
              />
            </div>

            <div className="flex flex-col gap-2">
              {courseDetail?.curriculum
                ?.filter((item) => item?.freePreview)
                .map((item, i) => (
                  <p
                    key={i}
                    onClick={() => handleSetFreePreview(item)}
                    className="cursor-pointer text-[16px] font-medium"
                  >
                    {item?.title}
                  </p>
                ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setShowDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CourseDetailPage;
