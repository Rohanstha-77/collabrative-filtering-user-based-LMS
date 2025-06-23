"use client";
import ProtectedRoute from "@/components/protected-route/page";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import CommonLayout from "@/components/student-view/common-layout";
import Image from "next/image";
import image from "../../../../../public/image.png";
import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import { studentCourseListService, getRecommendationService } from "@/services";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import { useRecommendation } from "@/context/recommendation";
import { Loader2 } from "lucide-react";
import Courses from "@/components/ui/courses";

const Dashboard = () => {
  // const {auth} = useContext(AuthContext)
  // console.log(auth.authenticate)
  // console.log(auth)
  const [showAllCourses, setShowAllCourses] = useState(false);
  const router = useRouter();

  const { studentCoursesList, setStudentCoursesList } =
    useContext(StudentContext);
  // console.log(category)
  const { auth } = useContext(AuthContext);
  // console.log(auth)
  // const [courseId, setCourseId] = useState(null)

  const [storeRecommendation, setStoreRecommendation] = useState(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true); // ✅ loader state

  const getRecommendation = async () => {
    try {
      setIsLoadingRecommendation(true);
      const response = await getRecommendationService(auth?.user?._id);
      if (response?.success) {
        setStoreRecommendation(response.data);
      }
    } catch (error) {
      console.error("Recommendation error:", error);
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const listOfCourses = async () => {
    const response = await studentCourseListService();
    // console.log(response)

    if (response?.success) setStudentCoursesList(response?.data);
  };
  const handleListPage = (label) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [label],
    };
    // console.log(label)
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    router.push(`/student/courses?category=${encodeURIComponent(label)}`);
  };
  // const { storeRecommendation } = useRecommendation();
  // console.log(storeRecommendation)

  // useEffect(() => {
  // },[])
  useEffect(() => {
    getRecommendation();
    listOfCourses();
  }, []);

  // console.log(storeRecommendation);
  return (
    <>
      <CommonLayout />
      <div className="min-h-screen bg-white">
        <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl font-bold mb-4 text-[#4F46E5]">
              Learning that gets you
            </h1>
            <p className="text-xl text-gray-500">
              Skills for your present and your future. Get started
            </p>
          </div>
          <div className="lg:w-full mb-8 lg:mb-0">
            <Image
              src={image}
              alt="Image"
              className="w-full h-[500px] rounded-lg shadow-lg"
            />
          </div>
        </section>

        <Courses />

        {/* <CourseCarousel/> */}

        <div className="w-full bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Recommended for You
          </h2>

          {isLoadingRecommendation ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin w-8 h-8 text-[#4F46E5]" />
            </div>
          ) : storeRecommendation?.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
              }}
              className=" ml-10 w-[95%]"
            >
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 p-2">
                  {storeRecommendation.map((item) => (
                    <Card
                      key={item.courseId}
                      className="hover:shadow-lg transition-shadow"
                      onClick={() =>
                        router.push(`student/course-detail/${item.courseId}`)
                      }
                    >
                      <CardContent className="p-4">
                        <Image
                          width={300}
                          height={200}
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-lg font-bold text-gray-800 mb-2">
                          Free
                        </p>
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={
                                  index < Math.floor(item.averageRating)
                                    ? "currentColor"
                                    : "none"
                                }
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {Math.floor(item.averageRating)} / 5
                          </span>
                        </div>
                        <button className="w-full px-4 py-2 bg-[#4F46E5] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <h1 className="text-center text-gray-500">
              No Recommendation for you
            </h1>
          )}
        </div>

        <section className="py-8 px-4 lg:px-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {courseCategories.map((items, i) => (
              <Button
                className="justify-start"
                key={i}
                onClick={() => handleListPage(items.id)}
                variant="secondary"
              >
                {items.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="py-12 px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Courses</h2>

          <div className="grid grid-cols sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentCoursesList && studentCoursesList.length > 0 ? (
              (showAllCourses
                ? studentCoursesList
                : studentCoursesList.slice(0, 4)
              ).map((items) => (
                <div
                  key={items?._id}
                  onClick={() =>
                    router.push(`/student/course-detail/${items?._id}`)
                  }
                  className="border rounded-lg overflow-hidden shadow cursor-pointer"
                >
                  <div className="h-[200px]">
                    <Image
                      src={items?.image}
                      alt="course image"
                      width={300}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold mb-2">{items?.title}</h3>
                    <p className="font-bold text-[16px]">
                      {items?.pricing > 0 ? items.pricing : "Free"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No courses Found</h1>
            )}
          </div>

          {studentCoursesList && studentCoursesList.length > 4 && (
            <div className="mt-6">
              <button
                onClick={() => setShowAllCourses((prev) => !prev)}
                className="text-[#4F46E5] hover:cursor-pointer hover:bg-blue-100 border-[#4F46E5] p-3 rounded-xl font-medium border-2 min-w-3"
              >
                {showAllCourses ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
