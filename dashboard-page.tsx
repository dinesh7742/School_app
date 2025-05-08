import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/nav-bar";
import { FeatureCard } from "@/components/feature-card";
import { useLocation } from "wouter";
import { BookOpen, BookText, Video, Bell, FileText, MessageSquare } from "lucide-react";
import { User } from "@shared/schema";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: homeworks } = useQuery({
    queryKey: ["/api/homeworks"],
  });
  
  const { data: liveClasses } = useQuery({
    queryKey: ["/api/live-classes"],
  });
  
  const { data: notices } = useQuery({
    queryKey: ["/api/notices"],
  });
  
  const { data: circulars } = useQuery({
    queryKey: ["/api/circulars"],
  });
  
  // Compute badge data
  const pendingHomeworks = homeworks?.filter(hw => hw.status === "pending") || [];
  const upcomingClass = liveClasses?.find(cls => cls.status === "upcoming");
  const newNotices = notices?.filter(notice => notice.isNew) || [];
  const newCirculars = circulars?.filter(circular => circular.isNew) || [];
  
  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Hi, {user.fullName}!</h1>
            <p className="text-sm text-gray-500">Class {user.classGrade} - Roll #{user.rollNumber}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-xl font-bold text-gray-500">
                {user.fullName[0]}
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="p-4">
        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            title="Homework"
            icon={<BookOpen className="w-5 h-5 text-primary-500" />}
            color="bg-primary-100"
            badge={pendingHomeworks.length > 0 ? {
              text: `${pendingHomeworks.length} pending`,
              color: "bg-green-100 text-green-800"
            } : undefined}
            onClick={() => navigate("/homework")}
          />
          
          <FeatureCard
            title="Textbooks"
            icon={<BookText className="w-5 h-5 text-blue-500" />}
            color="bg-blue-100"
            badge={{
              text: `${homeworks?.length || 0} books`,
              color: "bg-gray-100 text-gray-600"
            }}
            onClick={() => navigate("/textbooks")}
          />
          
          <FeatureCard
            title="Live Classes"
            icon={<Video className="w-5 h-5 text-red-500" />}
            color="bg-red-100"
            badge={upcomingClass ? {
              text: upcomingClass.status === "live" ? "Live Now" : "In 30 mins",
              color: "bg-orange-100 text-orange-800"
            } : undefined}
            onClick={() => navigate("/live-classes")}
          />
          
          <FeatureCard
            title="Notice Board"
            icon={<Bell className="w-5 h-5 text-purple-500" />}
            color="bg-purple-100"
            badge={newNotices.length > 0 ? {
              text: `${newNotices.length} new`,
              color: "bg-purple-100 text-purple-800"
            } : undefined}
            onClick={() => navigate("/notices")}
          />
          
          <FeatureCard
            title="Circulars"
            icon={<FileText className="w-5 h-5 text-yellow-500" />}
            color="bg-yellow-100"
            badge={newCirculars.length > 0 ? {
              text: `${newCirculars.length} new`,
              color: "bg-yellow-100 text-yellow-800"
            } : undefined}
            onClick={() => navigate("/circulars")}
          />
          
          <FeatureCard
            title="Complaint Box"
            icon={<MessageSquare className="w-5 h-5 text-teal-500" />}
            color="bg-teal-100"
            badge={{
              text: "Anonymous",
              color: "bg-teal-100 text-teal-800"
            }}
            onClick={() => navigate("/complaints")}
          />
        </div>
        
        {/* Upcoming Classes */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Classes</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {liveClasses && liveClasses.length > 0 ? (
              liveClasses.map((liveClass) => (
                <div key={liveClass.id} className="p-4 border-b border-gray-100 flex items-center">
                  <div className={`w-10 h-10 rounded-full ${liveClass.subject === 'Mathematics' ? 'bg-primary-100' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                    <Video className={`w-5 h-5 ${liveClass.subject === 'Mathematics' ? 'text-primary-500' : 'text-blue-500'}`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{liveClass.subject}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(liveClass.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}, 
                      {new Date(liveClass.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(liveClass.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button 
                    className={`px-3 py-1 ${liveClass.status === 'live' ? 'bg-red-500' : 'bg-primary-500'} text-white text-xs rounded-lg`}
                    onClick={() => window.open(liveClass.meetingLink, '_blank')}
                  >
                    {liveClass.status === 'live' ? 'Join Now' : 'Join'}
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No upcoming classes</div>
            )}
          </div>
        </div>
        
        {/* Latest Notices */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Latest Notices</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {notices && notices.length > 0 ? (
              notices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-800">{notice.title}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(notice.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{notice.content.slice(0, 100)}...</p>
                  <div className="flex justify-end">
                    <button 
                      className="text-xs text-primary-500 font-medium"
                      onClick={() => navigate(`/notices?id=${notice.id}`)}
                    >
                      Read more
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No notices available</div>
            )}
          </div>
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
