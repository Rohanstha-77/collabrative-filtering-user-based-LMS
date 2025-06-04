"use client";
import ProtectedRoute from "@/components/protected-route/page";
import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";
import SignIn from "./(auth)/signin/page";
import RouteGuard from "@/components/protected-route/page";

const Home = () => {
  const { auth } = useContext(AuthContext);
  // console.log(auth);
  return (
    <>
      <RouteGuard authenticated={auth.authenticate} user={auth.user}>
        <SignIn />
      </RouteGuard>
    </>
  );
};

export default Home;
