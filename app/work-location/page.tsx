"use client";

import { Key, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Building2, Home, Clock, ChevronRight } from "lucide-react";
import api from "@/lib/axiosService";
type Attendance = {
    type: string,
    workplace: string,
    created_at: string,
}
export default function WorkLocation() {
    const [location, setLocation] = useState<"wfh" | "onsite">("onsite");
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const today = new Date();
    const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: th });
    const formattedTime = format(today, "HH:mm", { locale: th });
    const [workTimeHistory, setWorkTimeHistory] = useState<any>([])
    const [showHistory, setShowHistory] = useState(false);

    const handleCheckInOut = () => {
        const action = isCheckedIn ? "ออกงาน" : "เข้างาน";
        const locationText = location === "wfh" ? "Work From Home" : "ที่สำนักงาน";
        createActivity(action, locationText);
    };
    const createActivity = (action: string, location: string) => {
        api
            .post("/api/attendance", {
                type: action,
                workplace: location,
            }).then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setIsCheckedIn(!isCheckedIn);
                }
            })
    };
    const getActivity = () => {
        api
            .get("/api/attendance?mode=month").then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setWorkTimeHistory(response.data.result)
                }
            })
    };
    useEffect(() => {
        getActivity();
    }, []);
    return (
        <div className="max-w-md mx-auto space-y-6">
            <Card className="shadow-xl">
                <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">ลงเวลาทำงาน</CardTitle>
                    <p className="text-blue-100 mt-1">{formattedDate}</p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">สถานที่ทำงาน</Label>
                        <RadioGroup
                            defaultValue="onsite"
                            value={location}
                            onValueChange={(value: "wfh" | "onsite") => setLocation(value)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem
                                    value="onsite"
                                    id="onsite"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="onsite"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                                >
                                    <Building2 className="mb-2 h-6 w-6" />
                                    <span>ที่สำนักงาน</span>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem
                                    value="wfh"
                                    id="wfh"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="wfh"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                                >
                                    <Home className="mb-2 h-6 w-6" />
                                    <span>Work From Home</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button
                        onClick={handleCheckInOut}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12"
                    >
                        {isCheckedIn ? "ออกงาน" : "เข้างาน"}
                    </Button>

                    {isCheckedIn && (
                        <div className="text-center text-sm text-gray-500">
                            เข้างานเมื่อ {formattedTime} น.
                        </div>
                    )}
                </CardContent>
                <Card
                    className="bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors m-5"
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
                        <p className="text-xs md:text-sm text-gray-600 mt-2">คลิกเพื่อดูประวัติการลงเวลา</p>
                    </CardContent>
                </Card>
            </Card>

            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-4">ประวัติการลงเวลา</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* {workTimeHistory.map((record: Attendance, index: Key | null | undefined) => (
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
                        ))} */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    );
}