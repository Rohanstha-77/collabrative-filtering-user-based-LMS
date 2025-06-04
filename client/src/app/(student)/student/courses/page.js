"use client"
import CommonLayout from '@/components/student-view/common-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { filterOptions, sortOptions } from '@/config'
import { StudentContext } from '@/context/student-context'
import { studentCourseListService } from '@/services'
import { ArrowDownIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'


const createSearchParamsHelper = (params) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}
const Courses = () => {
  const {studentCoursesList, setStudentCoursesList, loadingState, setLoadingState} = useContext(StudentContext)
  const [sort, setSort] = useState("price-lowtohigh")
  const [filters,setFilters] = useState({})
  const router = useRouter()

  const handleFilterOnChange = (id,getCurrentOption) => {
    let filter = {...filters}
    const indexOfCurrentSection = Object.keys(filter).indexOf(id)
    // console.log(indexOfCurrentSection,id)

    if(indexOfCurrentSection === -1 ){
      filter = {
        ...filter,
        [id] : [getCurrentOption.id]
      }
      // console.log(filter)
    }else{
      const indexOfCurrentOption = filter[id].indexOf(getCurrentOption.id)
      if(indexOfCurrentOption === -1) filter[id].push(getCurrentOption.id) 
      else filter[id].splice(indexOfCurrentOption,1)
    }
    setFilters(filter)
    sessionStorage.setItem("filters",JSON.stringify(filter))
  }
  // console.log(filters)

  const listOfCourses = async(filters,sort) => {
    
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort
    })
    const response =  await studentCourseListService(query)
      // console.log(response)

      if(response?.success) 
      {
        setStudentCoursesList(response?.data)
        setLoadingState(false)
      }
  }

  useEffect(() => {
    const queryString = createSearchParamsHelper(filters)
    router.push(`?${queryString}`,{scroll: false})
  },[filters])
   
  // onrefresh not changing the value
  useEffect(() => {
    setSort('price-lowtohigh')
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {})
  },[])

  useEffect(() => {
    if(filters !== null & sort !== null)
    listOfCourses(filters,sort)
  },[filters,sort])

  // ummount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters")
    }
  },[])

  return (
    <>
      <CommonLayout/>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#4F46E5]">All Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <aside className="w-full md:w-64 space-y-4">
            <div className="p-4 space-y-4">
              {
                Object.keys(filterOptions).map((items,i) => (
                  <div className='p-4 space-y-4' key={i}>
                    <h3 className='font-bold mb-3'>{items.toUpperCase()}</h3>
                    <div className="grid gap-2 mt-2">
                      {
                        filterOptions[items].map((option,i) => (
                          <Label key={i}>
                            <Checkbox checked={ filters && Object.keys(filters.length > 0) && filters[items] && filters[items].indexOf(option.id) > -1} onCheckedChange={() => handleFilterOnChange(items,option)}/>
                              {option.label}
                          </Label>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-end items-center mb-4 gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size={"sm"} className={"flex items-center gap-2 p-5"}>
                    <ArrowDownIcon className='h-4 w-4'/>
                    <span className='text-[16px] font-medium'>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={"w-[200px]"}>
                  <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                    {
                      sortOptions.map(items => 
                        <DropdownMenuRadioItem value={items.id} key={items.id}>
                          {items.label}
                        </DropdownMenuRadioItem>
                      )
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className='text-sm text-gray-900 font-bold'>{studentCoursesList.length} Result</span>
            </div>
            <div className='space-y-4'>
              {
                studentCoursesList && studentCoursesList.length > 0 ? studentCoursesList.map(items => 
                  <Card onClick = {() => router.push(`/student/course-detail/${items?._id}`)} className={"cursor-pointer"} key={items._id}>
                    <CardContent className={"flex gap-4 p-4"}>
                      <div className="w-48 h-32 flex-shrink-0">
                        <Image src={items.image} alt='image not found' width={500} height={500} className='w-full h-full object-contain'/>
                      </div>
                      <div className="flex-1">
                        <CardTitle className={"text-xl mb-2"}>
                          {items?.title}
                        </CardTitle>
                        <p className='text-sm text-gray-600 mt-3 mb-1'>
                         Created By <span className='font-bold'>{items?.adminName}</span>
                        </p>
                        <p className='text-[16px] text-gray-600  mb-2'>{`${items?.curriculum?.length} ${items?.curriculum?.length <=1 ? "Lecture" : "Lectures" } - ${items?.level.toUpperCase()} Level`}</p>

                        <p className='font-bold text-lg'>{items.pricing == false ? "Free" : `Rs ${items.pricing}`}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (loadingState  ? <Skeleton/> : <h1 className='text-4xl font-extrabold'>No Course Found</h1>)
              }
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Courses