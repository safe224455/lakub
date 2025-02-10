"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getProfile } from "@/provider/line";
import { Building2, Home } from "lucide-react";

export default function HomePage() {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: th });
  const [todayLeaves, setTodayLeaves] = useState<any[]>([]);
  const [workingUsers, setWorkingUsers] = useState<any[]>([
    {
      id: 1,
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      avatar: "",
      location: "onsite",
      checkInTime: "09:00"
    },
    {
      id: 2,
      name: "สมหญิง รักดี",
      email: "somying@example.com",
      avatar: "",
      location: "wfh",
      checkInTime: "08:45"
    }
  ]);

  const getLeaveData = async () => {
    const profile: any = await getProfile();
    const response = await fetch(`/api/leave/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': profile.userId
      },
    });
    if (!response.ok) {
      throw new Error('Failed to request');
    }
    const res: any[] = await response.json();
    setTodayLeaves(res);
  }

  useEffect(() => {
    getLeaveData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Working Status Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            พนักงานที่มาทำงานวันนี้
          </CardTitle>
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            {formattedDate}
          </p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {workingUsers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workingUsers.map((person) => (
                <Card key={person.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>
                          {person.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-gray-500">{person.email}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          {person.location === 'onsite' ? (
                            <Building2 className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Home className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm">
                            {person.location === 'onsite' ? 'ที่สำนักงาน' : 'Work From Home'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          เข้างานเวลา {person.checkInTime} น.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีพนักงานเข้างานในวันนี้
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Status Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            พนักงานที่ลาวันนี้
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {todayLeaves.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todayLeaves.map((person) => (
                <Card key={person.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>
                          {person.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-gray-500">{person.email}</p>
                        <div className="mt-2">
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-xs font-medium",
                            {
                              "bg-red-100 text-red-700": person.leaveType === "sick",
                              "bg-yellow-100 text-yellow-700": person.leaveType === "personal",
                              "bg-green-100 text-green-700": person.leaveType === "vacation",
                              "bg-gray-100 text-gray-700": person.leaveType === "other"
                            }
                          )}>
                            {person.leaveType === "sick" && "ลาป่วย"}
                            {person.leaveType === "personal" && "ลากิจ"}
                            {person.leaveType === "vacation" && "ลาพักร้อน"}
                            {person.leaveType === "other" && "ลาอื่นๆ"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {person.reason}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              ไม่มีพนักงานลาในวันนี้
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}