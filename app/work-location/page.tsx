"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Building2, Home } from "lucide-react";

export default function WorkLocation() {
    const [location, setLocation] = useState<"wfh" | "onsite">("onsite");
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const today = new Date();
    const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: th });
    const formattedTime = format(today, "HH:mm", { locale: th });

    const handleCheckInOut = () => {
        const action = isCheckedIn ? "ออกงาน" : "เข้างาน";
        const locationText = location === "wfh" ? "Work From Home" : "ที่สำนักงาน";

        toast.success(
            `${action}เวลา ${formattedTime} น. - ${locationText}`
        );

        setIsCheckedIn(!isCheckedIn);
    };

    return (
        <div className="max-w-md mx-auto">
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
            </Card>
        </div>
    );
}