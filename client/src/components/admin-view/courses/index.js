import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { courseDeleteService } from '@/services'
import { Delete, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'


const Courses = ({listOfCourses}) => {
  // console.log(listOfCourses)
  const router =useRouter()
  // console.log(listOfCourses)
  const handleDeleteCourse = async(id) => {
      const response = await courseDeleteService(id)

      if(response?.success){
          toast.success(response?.message)
          router.push('/admin')
      }else{toast.error(response?.message)}
  }

  return (
    <Card>
      <CardHeader className="flex justify-between flrx-row items-center">
        <CardTitle className="text-3xl font-extrabold">All courses</CardTitle>
        <Button onClick={() => router.push("admin/course/new")}className="p-6"> create New Courses</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                listOfCourses && listOfCourses.length > 0 ? listOfCourses.map(course =>
                  <TableRow key={course?._id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course?.students.length}</TableCell>
                      <TableCell>pricing data is net fetch </TableCell>
                      <TableCell className="text-right">
                        <Button onClick = {() => router.push(`/admin/course/${course?._id}`)} variant="ghost"size="sm">
                          <Edit className='h-6 w-6'/>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course?._id)}>
                          <Delete className='h-6 w-6'/>
                        </Button>
                    </TableCell>
                  </TableRow>
                 ) : null
              }
            </TableBody>
          </Table>

        </div>
      </CardContent>
    </Card>
  )
}

export default Courses