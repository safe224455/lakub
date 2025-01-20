"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, UserCircle, Users } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="font-bold text-xl text-blue-600 mr-8">ระบบจัดการการลา</div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-blue-600 flex items-center space-x-2",
              pathname === "/" ? "text-blue-600" : "text-gray-600"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            <span>หน้าหลัก</span>
          </Link>
          <Link
            href="/leave-request"
            className={cn(
              "transition-colors hover:text-blue-600 flex items-center space-x-2",
              pathname === "/leave-request" ? "text-blue-600" : "text-gray-600"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>ขอลา</span>
          </Link>
          <Link
            href="/profile"
            className={cn(
              "transition-colors hover:text-blue-600 flex items-center space-x-2",
              pathname === "/profile" ? "text-blue-600" : "text-gray-600"
            )}
          >
            <UserCircle className="h-4 w-4" />
            <span>โปรไฟล์</span>
          </Link>
          <Link
            href="/manage-users"
            className={cn(
              "transition-colors hover:text-blue-600 flex items-center space-x-2",
              pathname === "/manage-users" ? "text-blue-600" : "text-gray-600"
            )}
          >
            <Users className="h-4 w-4" />
            <span>จัดการผู้ใช้งาน</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}