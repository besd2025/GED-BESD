"use client";
import React, { useState,useEffect } from "react";
import Navbar from "@/src/components/UI/dashboard/navbar";
import Sidebar from "@/src/components/UI/dashboard/sidebar";
import { UserProvider } from "@/src/components/UI/context/User_Context";
import { useRouter } from "next/navigation";
export default function DashboardLayout({ children }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Variable déterminante pour la Navbar et le Contenu
  const isExpanded = isSidebarLocked || isHovered;
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  function DecodeToJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Échec du décodage du token", error);
      return null;
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("Access_Token");
    const now = new Date();
    if (!token) {
      router.replace("/");
    } else {
      const user = DecodeToJwt(token);
      if (now > new Date(user?.exp * 1000)) {
        localStorage.removeItem("Access_Token");
        router.replace("/");
      } else {
        setIsAuthChecked(true);
      }
    }
  }, []);
  if (!isAuthChecked) {
    return;
  }
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar
          isSidebarLocked={isSidebarLocked}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isExpanded ? "pl-64" : "pl-20"
          }`}
        >
          <Navbar
            isSidebarLocked={isSidebarLocked}
            setIsSidebarLocked={setIsSidebarLocked}
            isExpanded={isExpanded}
          />
          <main className="p-8 mt-18">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
