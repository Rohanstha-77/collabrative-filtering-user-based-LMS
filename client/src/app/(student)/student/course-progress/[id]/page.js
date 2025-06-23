"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/videoplayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getRatingService,
  markCourseProgressService,
  postRatingService,
  resetCourseProgressService,
  studentCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useCallback } from "react";
import ReactConfetti from "react-confetti";

const CourseProgress = () => {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const { studentCourseProgress, setStudentCourseProgress } =
    useContext(StudentContext);
  const { id } = useParams();
  const [lock, setLock] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [rating, setRating] = useState(0);

  // Renamed function to avoid naming conflict
  const fetchCourseProgress = useCallback(async () => {
    if (!auth?.user?._id || !id) return;
    
    try {
      const response = await studentCourseProgressService(auth?.user?._id, id);

      if (response?.data?.success) {
        if (!response?.data?.data?.isEnrolled) {
          setLock(true);
        } else {
          setStudentCourseProgress({
            courseDetails: response?.data?.data?.courseDetails,
            progress: response?.data?.data?.progress,
          });
          
          if (response?.data?.data?.completed) {
            setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0]);
            setShowCompleteDialog(true);
            setShowConfetti(true);
            return;
          }

          if (response?.data?.data?.progress.length === 0) {
            setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0]);
          } else {
            const lastIndexOfViewed = response?.data?.data?.progress.reduceRight(
              (acc, curr, index) => {
                return acc === -1 && curr.viewed ? index : acc;
              },
              -1
            );
            setCurrentLecture(
              response?.data?.data?.courseDetails?.curriculum[
                lastIndexOfViewed + 1
              ]
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  }, [auth?.user?._id, id, setStudentCourseProgress]);

  const updateCourseProgress = useCallback(async () => {
    if (currentLecture && auth?.user?._id && id) {
      try {
        const response = await markCourseProgressService(
          auth?.user?._id,
          id,
          currentLecture._id
        );
        if (response?.success) {
          await fetchCourseProgress(); // Await the function call
        }
      } catch (error) {
        console.error("Error updating course progress:", error);
      }
    }
  }, [currentLecture, auth?.user?._id, id, fetchCourseProgress]);

  const handleRewatch = async () => {
    if (!auth?.user?._id || !id) return;
    
    try {
      const response = await resetCourseProgressService(auth?.user?._id, id);

      if (response?.success) {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCompleteDialog(false);
        await fetchCourseProgress();
      }
    } catch (error) {
      console.error("Error resetting course progress:", error);
    }
  };

  const handleClick = async (value) => {
    setRating(value);

    try {
      const response = await postRatingService(id, auth?.user?._id, value);
      // Handle response if needed
    } catch (error) {
      console.error("Error posting rating:", error);
    }
  };

  // Fetch rating on component mount
  useEffect(() => {
    const fetchRating = async () => {
      if (!id || !auth?.user?._id) return;
      
      try {
        const response = await getRatingService(id, auth?.user?._id);

        if (response?.data?.rating != null) {
          setRating(response.data.rating);
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(0);
      }
    };

    fetchRating();
  }, [id, auth?.user?._id]);

  // Fetch course progress on component mount and when dependencies change
  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  // Update progress when lecture is completed
  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture?.progressValue, updateCourseProgress]);

  console.log("Current lecture:", currentLecture);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
        {showConfetti && <ReactConfetti />}
        <div className="flex justify-between p-4 items-center bg-[#1c1d1f] border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/student/courses-list")}
              className={"text-black cursor-pointer"}
              variant={"ghost"}
              size={"sm"}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to My Courses Page
            </Button>
            <h1 className="text-lg font-bold hidden md:block">
              {studentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
          <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            {isSideBarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`flex-1 ${
              isSideBarOpen ? "mr-[400px]" : ""
            } transition-all duration-300`}
          >
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
            <div className="p-6 bg-[#1c1d1f]">
              <h2 className="text-2xl font-bold mb-2">
                {currentLecture?.title}
              </h2>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleClick(star)}
                    className={`w-5 h-5 me-1 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-300"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {rating.toFixed(2)}
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  out of
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  5
                </p>
              </div>
            </div>
          </div>
          <div
            className={`fixed top-[68px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-1 border-gray-700 transition-all duration-300 ${
              isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Tabs defaultValue="content" className={"h-full flex flex-col"}>
              <TabsList
                className={"grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14"}
              >
                <TabsTrigger
                  value={"content"}
                  className={"bg-white rounded-none h-full text-black"}
                >
                  Course Content
                </TabsTrigger>
                <TabsTrigger
                  value={"overview"}
                  className={"bg-white rounded-none h-full text-black"}
                >
                  Overview
                </TabsTrigger>
              </TabsList>
              <TabsContent value={"content"}>
                <ScrollArea className={"h-full"}>
                  <div className="p-4 space-y-4">
                    {studentCourseProgress?.courseDetails?.curriculum.map(
                      (item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                          onClick={() => setCurrentLecture(item)}
                        >
                          {studentCourseProgress?.progress?.find(
                            (progressItem) =>
                              progressItem.lectureId === item._id
                          )?.viewed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          <span>{item?.title}</span>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value={"overview"}
                className={"flex-1 overflow-hidden"}
              >
                <ScrollArea className={"h-full"}>
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                      About this course
                    </h2>
                    <p className="text-gray-400">
                      {studentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Dialog open={lock}>
          <DialogContent className={"sm:w-[425px]"}>
            <DialogHeader>
              <DialogTitle>You cannot view this Page</DialogTitle>
            </DialogHeader>
            <DialogDescription>Please enroll in this course.</DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={showCompleteDialog}>
          <DialogContent className={"sm:w-[425px]"}>
            <DialogHeader>
              <DialogTitle>Congratulations</DialogTitle>
            </DialogHeader>
            <DialogDescription className={"flex flex-col gap-3"}>
              <Label>You have completed this course</Label>
            </DialogDescription>
            <div className="flex flex-row gap-3">
              <Button onClick={() => router.push("/student/courses")}>
                My courses page
              </Button>
              <Button onClick={handleRewatch}>Rewatch this course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CourseProgress;