"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function RouteGuard({ authenticated, user, children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if(!authenticated){
      return router.push("/")
    }
    if(authenticated && user?.role === "user" && pathname === "/"){
      return router.push("/student")
    }
    if(authenticated && user?.role === "admin" && pathname === "/"){
      return router.push("/admin")
    }
    if(authenticated && user?.role === "admin" && pathname.startsWith("/student")){
      return router.push("/admin")
    }
    if(authenticated && user?.role !== "admin" && pathname.startsWith("/admin")){
      return router.push("/student")
    }
    
  }, [authenticated, user, pathname, router]);

  return <>{children}</>;
}

export default RouteGuard;