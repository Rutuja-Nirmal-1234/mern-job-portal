import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import {Table,TableBody, TableCaption,TableCell,TableHead, TableHeader, TableRow,} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ResumeViewerDialog } from "../ResumeViewerDialog";
import { MoreHorizontal, Check, X, Loader2 } from "lucide-react";
import { updateApplicantStatus } from "@/redux/applicationSlice";

export const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const [loadingId, setLoadingId] = useState("");
  const dispatch = useDispatch();

  const openResumeHandler = (resumeUrl, resumeName) => {
    setSelectedResume({
      url: resumeUrl,
      name: resumeName,
    });

    setResumeOpen(true);
  };

  const statusHandler = async (status, applicationId) => {
    try {
      setLoadingId(applicationId);

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

     if (res.data.success) {
  dispatch(
    updateApplicantStatus({
      applicationId,
      status,
    })
  );

  toast.success(res.data.message);
}
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId("");
    }
  };
    
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableCaption className="py-4 text-gray-500">
          Applicants for this job
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-violet-50 hover:bg-violet-50">
            <TableHead className="pl-6">Applicant</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants?.applications?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-5xl">📄</div>

                  <h2 className="text-xl font-semibold">No Applicants Yet</h2>

                  <p className="text-gray-500">
                    No one has applied for this job.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applicants.applications.map((application) => (
              <TableRow
                key={application._id}
                className="hover:bg-violet-50 transition"
              >
                {/* Applicant */}
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border">
                      <AvatarImage
                        src={application?.applicant?.profile?.profilePhoto}
                      />

                      <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold">
                        {application?.applicant?.fullname
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">
                        {application?.applicant?.fullname}
                      </h3>

                     
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell>{application?.applicant?.email}</TableCell>

                {/* Contact */}
                <TableCell>{application?.applicant?.phoneNumber}</TableCell>

                {/* Resume */}
                <TableCell>
                  {application?.applicant?.profile?.resume ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-300 text-violet-700 hover:bg-violet-50"
                      onClick={() =>
                        openResumeHandler(
                          application.applicant.profile.resume,
                          application.applicant.profile.resumeOriginalName,
                        )
                      }
                    >
                      View Resume
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">No Resume</span>
                  )}
                </TableCell>
                {/* Status */}
                <TableCell>
                  <Badge
                    className={
                      application?.status === "accepted"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : application?.status === "rejected"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {application?.status?.charAt(0).toUpperCase() +
                      application?.status?.slice(1)}
                  </Badge>
                </TableCell>

                {/* Applied Date */}
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Action */}
                <TableCell className="text-right pr-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-52 p-2">
                      {/* Accept */}
                      <button
                        disabled={
                          application.status === "accepted" ||
                          loadingId === application._id
                        }
                        onClick={() =>
                          statusHandler("accepted", application._id)
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition
                          ${
                            application.status === "accepted"
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "hover:bg-green-50"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>Accept</span>
                        </div>

                        {loadingId === application._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          application.status === "accepted" && (
                            <Check className="h-4 w-4" />
                          )
                        )}
                      </button>

                      {/* Reject */}
                      <button
                        disabled={
                          application.status === "rejected" ||
                          loadingId === application._id
                        }
                        onClick={() =>
                          statusHandler("rejected", application._id)
                        }
                        className={`mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 transition
                          ${
                            application.status === "rejected"
                              ? "bg-red-100 text-red-700 cursor-default"
                              : "hover:bg-red-50"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </div>

                        {loadingId === application._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          application.status === "rejected" && (
                            <Check className="h-4 w-4" />
                          )
                        )}
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ResumeViewerDialog
        open={resumeOpen}
        setOpen={setResumeOpen}
        resumeUrl={selectedResume?.url}
        resumeName={selectedResume?.name}
      />
    </div>
  );
};
