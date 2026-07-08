import React, { useState } from "react";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { AppliedJobTable } from "./AppliedJobTable";
import { Footer } from "./Footer";
import { UpdateProfileDialog } from "./UpdateProfileDialog";
import { ResumeViewerDialog } from "./ResumeViewerDialog";
import { useSelector } from "react-redux";
import useGetappliedJobs from "@/hooks/useGetAppliedJob";

export const Profile = () => {
  useGetappliedJobs();
  const [open, setOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
              />
              <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>

              <p className="text-gray-600 text-sm mt-1">{user?.profile?.bio}</p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen />
          </Button>
        </div>

        <div className="my-5">
          <div className="flex items-center gap-4 my-2">
            <Mail />

            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <Contact />

            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        <div className="my-5">
          <h1 className="font-bold">Skills</h1>

          <div className="flex flex-wrap gap-2 mt-2">
            {user?.profile?.skills?.length !== 0 ? (
              user?.profile?.skills?.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        <div>
          <Label className="font-bold">Resume</Label>

          {user?.profile?.resume ? (
            <div className="mt-2">
              <button
                onClick={() => setResumeOpen(true)}
                className="text-blue-600 hover:underline"
              >
                {user.profile.resumeOriginalName}
              </button>
            </div>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-4 p-5 shadow-sm">
        <h1 className="font-bold text-lg mb-4">Applied Jobs</h1>

        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />

      <ResumeViewerDialog
        open={resumeOpen}
        setOpen={setResumeOpen}
        resumeUrl={user?.profile?.resume}
        resumeName={user?.profile?.resumeOriginalName}
      />
      <Footer />
    </div>
  );
};
