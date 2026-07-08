// ResumeViewerDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";

export const ResumeViewerDialog = ({ open, setOpen, resumeUrl, resumeName }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
    }
  }, [open, resumeUrl]);

  if (!resumeUrl) return null;

  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    resumeUrl
  )}&embedded=true`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{resumeName || "Resume"}</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 min-h-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          <iframe
            src={viewerUrl}
            title="Resume Viewer"
            className="w-full h-full"
            frameBorder="0"
            onLoad={() => setLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};