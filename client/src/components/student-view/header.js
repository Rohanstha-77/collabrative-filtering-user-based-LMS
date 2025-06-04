"use client"
import { GraduationCap, TvMinimalPlay } from 'lucide-react'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { AuthContext } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

const Header = () => {
    const {logOut} = useContext(AuthContext)
    const router = useRouter()
    
  return (
    <header className='flex items-center justify-between p-4 border-b relative'>
        <div className="flex items-center space-x-4">
            <Link href={"/student"} className='flex items-center hover:text-black'>
                <GraduationCap color='#4F46E5' className='h-14 w-8 mr-1'/>
                <span className='font-extrabold text-[#4F46E5] md:text-3xl text-[14px]'>LMS</span>
            </Link>

            <div className="flex items-center space-x-1">
                <button className='text-[#4F46E5] ml-6 text-2xl font-semibold text-[14px] md:text-[20px] cursor-pointer' onClick={() => router.push('/student/courses')}>Explore Courses</button>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex gap-4 items-center">
                <div onClick={() => router.push("/student/courses-list")} className="flex cursor-pointer items-center gap-3">
                    <span className='font-extrabold text-[#4F46E5] cursor-pointer md:text-xl text-[14px]'>My courses</span>
                    <TvMinimalPlay color='#4F46E5' className='w-8 h-8 cursor-pointer'/>
                </div>
                <Button className={"cursor-pointer"} onClick={logOut}>Log Out</Button>
            </div>
        </div>
    </header>
  )
}

export default Header