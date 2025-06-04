import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import React from 'react'

const Adashboard = ({listOfCourses}) => {

  // console.log(listOfCourses)
  // const calculateTotal = () => {
  // }
  const config = [
    {
      id: 1,
      icon: Users,
      label: "Total Students",
      value: 100
    },
  ]
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mb-8'>
        {
          config.map(items => (
            <Card key={items.id}>
              <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
                <CardTitle className={"text-sm font-medium"}>{items.label}</CardTitle>
              </CardHeader>
              <items.icon className='h-4 w-4 text-muted-foreground ml-[25px]'/>
              <CardContent>
                <div className='text-2xl font-bold'>{items.value}</div>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </>
  )
}

export default Adashboard