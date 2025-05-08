import React from "react";
import { FeatureCardProps } from "@/types";

export function FeatureCard({ title, icon, color, badge, onClick }: FeatureCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      {badge && (
        <div className={`mt-2 ${badge.color} px-2 py-1 rounded text-xs`}>
          {badge.text}
        </div>
      )}
    </div>
  );
}
