"use client";
import CommonLayout from "@/components/student-view/common-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  studentCourseDetailService,
  studentCourseListService,
} from "@/services";
import { ArrowDownIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const createSearchParamsHelper = (params) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
};
const Courses = () => {
  const {
    studentCoursesList,
    setStudentCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const [sort, setSort] = useState("rate");
  const [filters, setFilters] = useState({});
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const handleFilterOnChange = (id, getCurrentOption) => {
    console.log(getCurrentOption);
    let filter = { ...filters };
    const indexOfCurrentSection = Object.keys(filter).indexOf(id);

    if (indexOfCurrentSection === -1) {
      filter = {
        ...filter,
        [id]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = filter[id].indexOf(getCurrentOption.id);
      if (indexOfCurrentOption === -1) filter[id].push(getCurrentOption.id);
      else filter[id].splice(indexOfCurrentOption, 1);
    }
    setFilters(filter);
    sessionStorage.setItem("filters", JSON.stringify(filter));
  };
  // console.log(filters)

  const listOfCourses = async (filters, sort) => {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    }).toString();
    // console.log(query);
    const response = await studentCourseListService(query);
    // console.log(response?.success);
    if (response?.success) {
      setStudentCoursesList(response?.data);
      setLoadingState(false);
    } else {
      setStudentCoursesList(response?.data);
      setLoadingState(false);
    }
  };

  // useEffect(() => {
    const checkEnrollment = async (courseId) => {
      try {
        const response = await studentCourseDetailService(
          courseId,
          auth?.user?._id
        );

        if (response?.success && response.enrollCourseID) {
          router.push(`/student/course-progress/${response.enrollCourseID}`);
        } else {
          router.push(`/student/course-detail/${courseId}`);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

  //   if (studentCoursesList?._id && auth?._id) {
  //     fetchCourseDetail();
  //   }
  // }, [studentCoursesList?._id, auth?._id]);

  // console.log(studentCoursesList._id);

  useEffect(() => {
    const queryString = createSearchParamsHelper(filters);
    router.push(`?${queryString}`, { scroll: false });
  }, [filters]);

  useEffect(() => {
    setSort("rate");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if ((filters !== null) & (sort !== null)) listOfCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <>
      <CommonLayout />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#4F46E5]">All Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <aside className="w-full md:w-64 space-y-4">
            <div className="p-4 space-y-4">
              {Object.keys(filterOptions).map((filterKey) => (
                <div className="p-4 space-y-4" key={filterKey}>
                  <h3 className="font-bold mb-3">{filterKey.toUpperCase()}</h3>
                  <div className="grid gap-2 mt-2">
                    {filterOptions[filterKey].map((option) => (
                      <Label
                        key={option.id}
                        className="flex items-center gap-3"
                      >
                        <Checkbox
                          checked={
                            filters?.[filterKey]?.includes(option.id) || false
                          }
                          onCheckedChange={() =>
                            handleFilterOnChange(filterKey, option)
                          }
                        />
                        {option.label}
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-end items-center pb-4 gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className={"flex items-center gap-2 p-5"}
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                    <span className="text-[16px] font-medium">Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={"w-[200px]"}>
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value)}
                  >
                    {sortOptions.map((items) => (
                      <DropdownMenuRadioItem value={items.id} key={items.id}>
                        {items.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-gray-900 font-bold">
                {studentCoursesList.length} Result
              </span>
            </div>
            <div className="space-y-4">
              {studentCoursesList && studentCoursesList.length > 0 ? (
                studentCoursesList.map((items) => (
                  <Card onClick = {() => checkEnrollment(items._id)} className={"cursor-pointer"} key={items._id}>
                    <CardContent className={"flex gap-4 mx-9 p-4"}>
                      <div className="w-48 h-32 shrink-0">
                        <Image
                          src={items.image}
                          alt="image not found"
                          width={500}
                          height={500}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={"text-xl mb-2"}>
                          {items?.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-3 mb-1">
                          Created By{" "}
                          <span className="font-bold">{items?.adminName}</span>
                        </p>
                        <p className="text-[16px] text-gray-600  mb-2">{`${
                          items?.curriculum?.length
                        } ${
                          items?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${items?.level.toUpperCase()} Level`}</p>

                        <p className="font-bold text-lg">
                          {items.pricing == null || items.pricing == false
                            ? "Free"
                            : `Rs ${items.pricing}`}
                        </p>
                      </div>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              index < Math.floor(items.averageRating)
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
                    </CardContent>
                  </Card>
                ))
              ) : loadingState ? (
                <Skeleton />
              ) : (
                <h1 className="text-4xl font-extrabold">No Course Found</h1>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Courses;
