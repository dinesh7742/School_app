import React, { useEffect, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // In a real app, we would load the PDF here using pdf.js
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleDownload = () => {
    // In a real app, we would download the PDF here
    window.open(url, '_blank');
  };

  const increaseZoom = () => {
    if (zoom < 2) {
      setZoom(prev => prev + 0.1);
    }
  };

  const decreaseZoom = () => {
    if (zoom > 0.5) {
      setZoom(prev => prev - 0.1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-medium truncate">{title}</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-800 flex flex-col items-center justify-center p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3"></div>
            <p>Loading document...</p>
          </div>
        ) : error ? (
          <div className="text-white text-center">
            <p>Error loading PDF: {error}</p>
            <Button variant="secondary" className="mt-3" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div 
            className="bg-white max-w-full max-h-full overflow-auto shadow-lg transition-transform"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* This would be rendered by pdf.js in a real app */}
            <div className="w-[800px] h-[1100px] flex items-center justify-center">
              <p className="text-gray-400">PDF would be displayed here</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">Page 1 of 10</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={decreaseZoom}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="icon" onClick={increaseZoom}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
