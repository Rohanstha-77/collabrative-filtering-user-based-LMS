"use client";
import Loader from "@/components/ui/loader";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuth, loginService, registerService } from "@/services";
import { Children, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [signinFormData, setSigninFormData] = useState(initialSignInFormData);
  const [signupFormData, setSignupFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true); // Added loading state


  const handleRegisterUser = async (e) => {
    e.preventDefault();
    const data = await registerService(signupFormData);
    if(data?.success){
     toast.success(data?.message) 
    }else{
      toast.error(data?.message)
    }
  };
  const handleLoginUser = async (e) => {
    e.preventDefault();
    const loginData = await loginService(signinFormData);
    // console.log(loginData.data.user)
    
    if (loginData.success) {
      toast.success(loginData?.message) 
      sessionStorage.setItem("accessToken", loginData.data.accessToken);
    //   sessionStorage.setItem("userData", JSON.stringify(loginData.data.user))
      // console.log(loginData.data.user)
      setAuth({
        authenticate: true,
        user: loginData.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
      toast.error(loginData?.message)
    }
  };
  const checkAuthUser = async () => {
    const data = await checkAuth();

    if (data.success) {
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
    setLoading(false);
  };

  const logOut = () => {

      toast.success("logout sucessfully")
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      checkAuthUser();
    }else{
        setLoading(false); 
    }
    // console.log(auth)
  }, []);
  if (loading) {
    return <Loader/> 
  }

//   console.log(auth);

  return (
    <AuthContext.Provider
      value={{
        signinFormData,
        setSigninFormData,
        signupFormData,
        setSignupFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
