"use client"
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommonForm from '@/components/common-form/page.js'
import { signInFormControls, signupFormControls } from '@/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthContext } from '@/context/auth-context/index.js'



const SignIn = () => {

  const [activeTab,setActiveTab] = useState('signin')

  const {signinFormData, setSigninFormData, signupFormData, setSignupFormData, handleRegisterUser, handleLoginUser} = useContext(AuthContext)

  const checkIfFormIsValid = () => {
    return signinFormData && signinFormData.email !=='' && signinFormData.password !== ''
  }
  const checkIfSUFormIsValid = () => {
    return signupFormData && signupFormData.username !== '' && signupFormData.email !== '' && signupFormData.password !== ''
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }
  // console.log(signinFormData)
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex item-center border-b">
          <Link href='/' className='flex items-center justify-center'>
            <GraduationCap className='h-8 w-8 mr-4'/>
            <span className="font-extrabold text-xl">LMS</span>
          </Link>
        </header>

        <div className='flex items-center justify-center min-h-screen bg-background'>
        <Tabs value={activeTab} defaultValue="signin" onValueChange={handleTabChange} className="w-full max-w-md">

          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value = 'signin'>Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <CommonForm formControls={signInFormControls} buttonText={'sign in'} formData={signinFormData} setFormData={setSigninFormData} isButtonDisabled={!checkIfFormIsValid()} handleSubmit={handleLoginUser}/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
          <Card className="p-6 sapce-y-4">
              <CardHeader>
                <CardTitle>Creat your new account</CardTitle>
                <CardDescription>
                  Enter your detail to get started
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <CommonForm formControls={signupFormControls} buttonText={'sign up'} formData={signupFormData} setFormData={setSignupFormData} isButtonDisabled={!checkIfSUFormIsValid()} handleSubmit={handleRegisterUser}/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        </div>
      </div>

    </>
  )
}

export default SignIn