"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Plus, Trash2, RefreshCw } from "lucide-react";

// Mock initial users data
const initialUsers = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai@example.com", roomCode: "R001" },
  { id: 2, name: "สมหญิง รักดี", email: "somying@example.com", roomCode: "R002" },
  { id: 3, name: "วิชัย สุขใจ", email: "wichai@example.com", roomCode: "R003" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Generate a random room code
  const generateRoomCode = () => {
    const prefix = "R";
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `${prefix}${randomNum}`;
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!newUser.email.includes("@")) {
      toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    const roomCode = generateRoomCode();
    const newUserWithId = {
      id: users.length + 1,
      ...newUser,
      roomCode,
    };

    setUsers([...users, newUserWithId]);
    setNewUser({ name: "", email: "" });
    setIsAddUserOpen(false);
    toast.success(`เพิ่มผู้ใช้งานเรียบร้อย - รหัสห้อง: ${roomCode}`);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("ลบผู้ใช้งานเรียบร้อย");
  };

  const handleRegenerateRoomCode = (id: number) => {
    const newRoomCode = generateRoomCode();
    setUsers(users.map(user => 
      user.id === id ? { ...user, roomCode: newRoomCode } : user
    ));
    toast.success(`สร้างรหัสห้องใหม่เรียบร้อย: ${newRoomCode}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8" />
              <CardTitle className="text-2xl">จัดการผู้ใช้งาน</CardTitle>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>เพิ่มผู้ใช้งาน</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>ชื่อ-นามสกุล</Label>
                    <Input
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>อีเมล</Label>
                    <Input
                      type="email"
                      placeholder="กรอกอีเมล"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddUser}
                  >
                    เพิ่มผู้ใช้งาน
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>รหัสห้อง</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{user.roomCode}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRegenerateRoomCode(user.id)}
                          className="h-8 w-8"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}