"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";
type Profile = {
  userId: string,
  displayName: string,
  pictureUrl: string,
  statusMessage: string,
}
import { getProfile } from "@/provider/line"
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
    // setDisable
  }
  useEffect(() => {
    getUser()
  }, [])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.roomCode || !formData.name || !formData.email) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    // Here you would typically save the data
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
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg space-y-2">
          <UserCircle className="w-16 h-16 mx-auto text-blue-100" />
          <CardTitle className="text-2xl sm:text-3xl">ข้อมูลส่วนตัว </CardTitle>
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
    </div>
  );
}