import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Spinner from "../spinner";
const CustomAuthContext = createContext({});
export default function CustomAuthProvider({ children }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const protectedRoute = ["task"];
  const unProtectedRoute = ["signin", "register"];
  const router = useRouter();
  const [displayName, setDisplayName] = useState();

  const protectedRouteCheck = protectedRoute.filter((p) =>
    router.pathname.toUpperCase().includes(p.toUpperCase())
  );
  const unProtectedRouteCheck = unProtectedRoute.filter((p) =>
    router.pathname.toUpperCase().includes(p.toUpperCase())
  );
  const { data, error, isValidating, mutate } = useSWR(
    `/api/personal`,
    fetcher,
    {
      refreshInterval: 3000,
    }
  );
useEffect(()=>{
  if (data?.message == null) {
    setDisplayName(data?.displayName);
  }
})
  if (!data) return <Spinner showLoading="true"></Spinner>;
  if (data?.message != null) {
    if (protectedRouteCheck.length > 0) {
      window.location.replace("/auth/signin");
    }
  } else {
    if (unProtectedRouteCheck.length > 0) {
      router.back();
    }
  }

  return (
    data && (
      <CustomAuthContext.Provider value={{displayName:displayName}}>
        {children}
      </CustomAuthContext.Provider>
    )
  );
}

export const useCustomAuthContext = () => {
  const context = useContext(CustomAuthContext);

  if (!context) {
    throw new Error("useCustomAuthContext must be used within an CustomAuthContext");
  }

  return context;
};
