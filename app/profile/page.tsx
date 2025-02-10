"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCircle, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

type Profile = {
  userId: string,
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
}

import { getProfile } from "@/provider/line"

// Mock data for work time history
const workTimeHistory = [
  {
    date: "2024-03-25",
    checkIn: "09:00",
    checkOut: "18:00",
    location: "onsite"
  },
  {
    date: "2024-03-24",
    checkIn: "08:45",
    checkOut: "17:30",
    location: "wfh"
  }
];

// Mock data for leave history
const leaveHistory = [
  {
    dateFrom: "2024-03-20",
    dateTo: "2024-03-22",
    type: "sick",
    reason: "ไข้หวัดใหญ่",
    status: "approved"
  },
  {
    dateFrom: "2024-03-15",
    dateTo: "2024-03-15",
    type: "personal",
    reason: "ธุระส่วนตัว",
    status: "approved"
  }
];

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState<boolean>(true)

  const [formData, setFormData] = useState({
    roomCode: "",
    name: "",
    email: "",
  });
  const [disable, setDisable] = useState(false);

  const updateUser = async (body: any) => {
    const profile: any = await getProfile()
    const response = await fetch(`/api/users/${profile?.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, pictureUrl: profile?.pictureUrl || '' })
    });
    if (!response.ok) {
      throw new Error('Failed to request');
    }
  }

  const getUser = async () => {
    const profile: any = await getProfile()
    const response = await fetch(`/api/users/${profile?.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to request');
    }
    let res: any = await response.json()
    toast.success("บันทึกข้อมูลเรียบร้อย");

    setFormData(prev => ({ ...prev, ...res }))
    setDisable(true)
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomCode || !formData.name || !formData.email) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    updateUser(formData)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg space-y-2">
          <UserCircle className="w-16 h-16 mx-auto text-blue-100" />
          <CardTitle className="text-2xl sm:text-3xl">ข้อมูลส่วนตัว</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomCode" className="text-base">รหัสห้อง</Label>
                <Input
                  id="roomCode"
                  name="roomCode"
                  placeholder="กรอกรหัสห้อง"
                  value={formData.roomCode}
                  onChange={handleChange}
                  className="text-lg"
                  disabled={disable}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-lg"
                  disabled={disable}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">อีเมล</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-lg"
                  disabled={disable}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12"
            >
              บันทึกข้อมูล
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Work Time History */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <CardTitle>ประวัติการลงเวลา</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {workTimeHistory.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(record.date), 'd MMMM yyyy', { locale: th })}
                  </p>
                  <p className="text-sm text-gray-600">
                    เข้างาน {record.checkIn} น. - ออกงาน {record.checkOut} น.
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${record.location === 'onsite'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                  {record.location === 'onsite' ? 'ที่สำนักงาน' : 'Work From Home'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6" />
            <CardTitle>ประวัติการลา</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {leaveHistory.map((leave, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(new Date(leave.dateFrom), 'd MMMM yyyy', { locale: th })}
                      {leave.dateFrom !== leave.dateTo && (
                        <> - {format(new Date(leave.dateTo), 'd MMMM yyyy', { locale: th })}</>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${leave.type === 'sick'
                      ? 'bg-red-100 text-red-800'
                      : leave.type === 'personal'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {leave.type === 'sick' ? 'ลาป่วย' : leave.type === 'personal' ? 'ลากิจ' : 'ลาพักร้อน'}
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="text-sm text-green-600">อนุมัติแล้ว</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}