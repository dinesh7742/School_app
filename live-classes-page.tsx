import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, Video, Calendar, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function LiveClassesPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("today");
  const { toast } = useToast();

  const { data: liveClasses, isLoading } = useQuery({
    queryKey: ["/api/live-classes"],
  });

  // Filter classes based on selected date range
  const filteredClasses = liveClasses?.filter(liveClass => {
    const classDate = new Date(liveClass.date);
    const today = new Date();
    
    const tomorrow = addDays(today, 1);
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    
    switch (activeTab) {
      case "today":
        return isToday(classDate);
      case "tomorrow":
        return isTomorrow(classDate);
      case "thisWeek":
        return classDate >= weekStart && classDate <= weekEnd;
      default:
        return true;
    }
  });

  const handleJoinClass = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleSetReminder = (id: number, subject: string) => {
    // In a real app, we would set up a notification
    toast({
      title: "Reminder set",
      description: `You will be notified before the ${subject} class starts`,
    });
  };

  const getStatusLabel = (status: string, startTime: string) => {
    if (status === "live") return "Live Now";
    
    const startDateTime = new Date(startTime);
    const now = new Date();
    const diffMs = startDateTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 0) return format(startDateTime, "h:mm a");
    if (diffMins < 60) return `In ${diffMins} mins`;
    
    return format(startDateTime, "h:mm a");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Live Classes</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        {/* Date Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4">
          <Button 
            variant={activeTab === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("today")}
          >
            Today
          </Button>
          <Button 
            variant={activeTab === "tomorrow" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("tomorrow")}
          >
            Tomorrow
          </Button>
          <Button 
            variant={activeTab === "thisWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("thisWeek")}
          >
            This Week
          </Button>
        </div>
        
        {/* Live Classes List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredClasses && filteredClasses.length > 0 ? (
            filteredClasses.map((liveClass) => (
              <div key={liveClass.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full ${
                    liveClass.status === "live" ? "bg-red-100" : 
                    liveClass.subject === "Mathematics" ? "bg-primary-100" : 
                    liveClass.subject === "Science" ? "bg-blue-100" : "bg-purple-100"
                  } flex items-center justify-center flex-shrink-0`}>
                    <Video className={`w-5 h-5 ${
                      liveClass.status === "live" ? "text-red-500" : 
                      liveClass.subject === "Mathematics" ? "text-primary-500" : 
                      liveClass.subject === "Science" ? "text-blue-500" : "text-purple-500"
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">{liveClass.subject}</h3>
                    <p className="text-xs text-gray-500">{liveClass.teacher}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      liveClass.status === "live" ? "bg-red-100 text-red-600" : 
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {getStatusLabel(liveClass.status, liveClass.startTime)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {format(new Date(liveClass.date), "EEE, dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>
                      {format(new Date(liveClass.startTime), "h:mm a")} - {format(new Date(liveClass.endTime), "h:mm a")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  {liveClass.status === "live" ? (
                    <Button 
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleJoinClass(liveClass.meetingLink)}
                    >
                      Join Now
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => handleSetReminder(liveClass.id, liveClass.subject)}
                    >
                      <Bell className="w-4 h-4 mr-1" /> Set Reminder
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No live classes scheduled</p>
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
