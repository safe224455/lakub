import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data for team members on leave today
const todayLeaves = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    leaveType: "sick",
    reason: "ไข้หวัดใหญ่",
    duration: "เต็มวัน"
  },
  {
    id: 2,
    name: "สมหญิง รักดี",
    email: "somying@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    leaveType: "personal",
    reason: "ธุระส่วนตัว",
    duration: "ช่วงเช้า"
  },
  {
    id: 3,
    name: "วิชัย สุขใจ",
    email: "wichai@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    leaveType: "vacation",
    reason: "พักร้อนประจำปี",
    duration: "เต็มวัน"
  }
];

export default function Home() {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: th });

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            พนักงานที่ลาวันนี้
          </CardTitle>
          <p className="text-blue-100 mt-1 text-sm sm:text-base">
            {formattedDate}
          </p>
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
                              "bg-green-100 text-green-700": person.leaveType === "vacation"
                            }
                          )}>
                            {person.leaveType === "sick" && "ลาป่วย"}
                            {person.leaveType === "personal" && "ลากิจ"}
                            {person.leaveType === "vacation" && "ลาพักร้อน"}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {person.duration}
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