"use client";

// Move the entire content of the old app/page.tsx here
// This is the leave request form that was previously on the home page
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isWeekend, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProfile } from "@/provider/line"
// Mock data for remaining leave days
const mockRemainingLeave = {
  sick: 30,
  personal: 10,
  vacation: 10
};

// Mock data for leave history
const mockLeaveHistory = [
  {
    month: "เมษายน 2024",
    leaves: [
      {
        dateFrom: "2024-04-01",
        dateTo: "2024-04-03",
        leaveType: "sick",
        reason: "ไข้หวัดใหญ่",
        numberOfDays: 3
      },
      {
        dateFrom: "2024-04-10",
        dateTo: "2024-04-10",
        leaveType: "personal",
        reason: "ธุระส่วนตัว",
        numberOfDays: 1
      }
    ]
  },
  {
    month: "มีนาคม 2024",
    leaves: [
      {
        dateFrom: "2024-03-15",
        dateTo: "2024-03-17",
        leaveType: "vacation",
        reason: "ท่องเที่ยวต่างจังหวัด",
        numberOfDays: 3
      }
    ]
  }
];

// Function to calculate business days between two dates
const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // 0 = Sunday, 6 = Saturday
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

// Function to check if a date should be disabled
const isDateDisabled = (date: Date) => {
  return isWeekend(date);
};

export default function LeaveRequest() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showRemainingLeave, setShowRemainingLeave] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState(mockLeaveHistory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !leaveType || !reason) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Calculate business days
    const businessDays = calculateBusinessDays(date.from, date.to);

    try {
      let profile: any = await getProfile()
      const leaveData = {
        // email,
        user_id: profile.userId,
        dateFrom: date.from.toISOString(),
        dateTo: date.to.toISOString(),
        numberOfDays: businessDays,
        leaveType,
        reason,
        requestedAt: new Date().toISOString()
      };

      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      // if (!response.ok) {
      //   throw new Error('Failed to submit leave request');
      // }

      toast.success("ส่งคำขอลาเรียบร้อยแล้ว");
      setDate({ from: new Date(), to: new Date() });
      setLeaveType("");
      setReason("");
      setEmail("");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งคำขอลา");
      console.error('Error submitting leave request:', error);
    }
  };

  // Calculate business days for display
  const businessDays = date?.from && date?.to
    ? calculateBusinessDays(date.from, date.to)
    : 0;

  const totalRemainingDays = Object.values(mockRemainingLeave).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4 md:p-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">ระบบขออนุมัติการลา</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 ">
                {/* <div>
                  <Label className="text-base md:text-lg font-semibold">อีเมล</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="กรุณากรอกอีเมล"
                    className="mt-1 md:mt-2"
                    required
                  />
                </div> */}
                <div>
                  <Label className="text-base md:text-lg font-semibold ">ประเภทการลา</Label>
                  <div className="pb-[8px]"></div>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger className="mt-1 md:mt-2">
                      <SelectValue placeholder="เลือกประเภทการลา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">ลาป่วย</SelectItem>
                      <SelectItem value="personal">ลากิจ</SelectItem>
                      <SelectItem value="vacation">ลาพักร้อน</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base md:text-lg font-semibold">เหตุผลการลา</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="กรุณาระบุเหตุผลการลา"
                    className="mt-1 md:mt-2"
                    rows={4}
                  />
                </div>

                {date?.from && date?.to && (
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-base text-blue-600">
                      จำนวนวันที่ลา: {businessDays} วัน
                      <br />
                      <span className="text-xs md:text-sm text-gray-500">(ไม่รวมวันเสาร์-อาทิตย์)</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base md:text-lg font-semibold">ช่วงวันที่ต้องการลา</Label>
                <div className="border rounded-lg p-2 sm:p-3 md:p-4 bg-white overflow-x-auto " >
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    className="rounded-md mx-auto w-full max-w-[350px]"
                    disabled={isDateDisabled}
                    modifiers={{ disabled: isDateDisabled }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
                onClick={() => {
                  setDate({ from: new Date(), to: new Date() });
                  setLeaveType("");
                  setReason("");
                  setEmail("");
                }}
              >
                ล้างข้อมูล
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
              >
                ส่งคำขอลา
              </Button>
            </div>
          </form>

          <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Card
              className="bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setShowRemainingLeave(true)}
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span className="font-medium text-sm md:text-base">วันลาคงเหลือ</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-2">{totalRemainingDays} วัน</p>
              </CardContent>
            </Card>

            <Card
              className="bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setShowHistory(true)}
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span className="font-medium text-sm md:text-base">ลาล่าสุด</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-2">คลิกเพื่อดูประวัติการลา</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Leave Days Dialog */}
      <Dialog open={showRemainingLeave} onOpenChange={setShowRemainingLeave}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">วันลาคงเหลือ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ลาป่วย</span>
                  <span className="text-blue-600 font-bold">{mockRemainingLeave.sick} วัน</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ลากิจ</span>
                  <span className="text-blue-600 font-bold">{mockRemainingLeave.personal} วัน</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ลาพักร้อน</span>
                  <span className="text-blue-600 font-bold">{mockRemainingLeave.vacation} วัน</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">ประวัติการลา</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {leaveHistory.map((monthData, monthIndex) => (
              <div key={monthIndex} className="space-y-3">
                <h3 className="font-semibold text-lg text-blue-600">{monthData.month}</h3>
                <div className="space-y-2">
                  {monthData.leaves.map((leave, leaveIndex) => (
                    <Card key={leaveIndex} className="bg-gray-50">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {format(new Date(leave.dateFrom), 'd MMM')} - {format(new Date(leave.dateTo), 'd MMM yyyy')}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {leave.leaveType === 'sick' && 'ลาป่วย'}
                              {leave.leaveType === 'personal' && 'ลากิจ'}
                              {leave.leaveType === 'vacation' && 'ลาพักร้อน'}
                              {leave.leaveType === 'other' && 'ลาอื่นๆ'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                          </div>
                          <span className="text-blue-600 font-medium">
                            {leave.numberOfDays} วัน
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}