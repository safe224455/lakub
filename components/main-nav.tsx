"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, UserCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "@/provider/line"

type Profile = {
  userId: string,
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
}
export function MainNav() {
  const [name, setName] = useState('')
  const [profile, setProfile] = useState<Profile>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getProfile().then((res: any) => {
      setName(res.displayName)
      setProfile(res)

    })
  }, [])

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
          <div className="font-bold text-xl text-blue-600 mr-8">ระบบจัดการการลา </div>
          <div className="flex items-center gap-2">
            <div>{name}</div>
            {name && <div><img src={profile?.pictureUrl} alt="img-profile" width={30} height={30} className=" rounded-md"></img></div>}
          </div>
        </div>
      </div>
      <Menu />
    </>
  );
}
const Menu = () => {
  const pathname = usePathname();
  return <nav className="flex flex-col sm:flex-row  items-center text-sm font-medium justify-around m-5">
    <div className="flex w-full  justify-between">
      <Link
        href="/"
        className={cn(
          "transition-colors hover:text-blue-600 flex  items-center space-x-2  px-4 py-2 rounded-md",
          pathname === "/" ? "text-blue-600 bg-white" : "text-gray-600"
        )}
      >
        <CalendarDays className="h-4 w-4" />
        <span>หน้าหลัก</span>
      </Link>
      <Link
        href="/leave-request"
        className={cn(
          "transition-colors hover:text-blue-600 flex items-center space-x-2  px-4 py-2 rounded-md",
          pathname === "/leave-request" ? "text-blue-600 bg-white" : "text-gray-600"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>ขอลา</span>
      </Link>
    </div>
    <div className="flex w-full justify-between">
      <Link
        href="/profile"
        className={cn(
          "transition-colors hover:text-blue-600 flex items-center space-x-2  px-4 py-2 rounded-md",
          pathname === "/profile" ? "text-blue-600 bg-white" : "text-gray-600"
        )}
      >
        <UserCircle className="h-4 w-4" />
        <span>โปรไฟล์</span>
      </Link>
      <Link
        href="/manage-users"
        className={cn(
          "transition-colors hover:text-blue-600 flex items-center space-x-2  px-4 py-2 rounded-md",
          pathname === "/manage-users" ? "text-blue-600 bg-white" : "text-gray-600"
        )}
      >
        <Users className="h-4 w-4" />
        <span>จัดการผู้ใช้งาน</span>
      </Link>
    </div>
  </nav>
}