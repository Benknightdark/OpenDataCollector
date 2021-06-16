import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Spinner from "../spinner";
const CustomAuthContext = createContext({});
export default function CustomSnackBarProvider({ children }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const protectedRoute = ["task"];
  const unProtectedRoute = ["signin", "register"];
  const router = useRouter();
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
      refreshInterval: 60000,
    }
  );

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
      <CustomAuthContext.Provider value={{}}>
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
