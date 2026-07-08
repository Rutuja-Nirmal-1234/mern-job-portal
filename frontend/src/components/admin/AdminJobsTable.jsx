import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Edit2, MoreHorizontal, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const navigate = useNavigate();

  const [filterJobs, setFilterJobs] = useState(
    Array.isArray(allAdminJobs) ? allAdminJobs : [],
  );

  useEffect(() => {
    if (!Array.isArray(allAdminJobs)) {
      setFilterJobs([]);
      return;
    }

    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;

      return (
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <Table>
        <TableCaption className="py-4 text-gray-500">
          All jobs posted by you
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="pl-6">Logo</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-5xl">💼</div>

                  <h2 className="font-semibold text-xl">No Jobs Found</h2>

                  <p className="text-gray-500">
                    Start by posting your first job.
                  </p>

                  <Button onClick={() => navigate("/admin/jobs/create")}>
                    + Post Job
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-violet-50 transition">
                <TableCell className="pl-6">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage
                      src={job.company?.logo}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-violet-100 text-violet-700 font-bold">
                      {job.company?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell>
                  <div>
                    <h3 className="font-semibold">{job.company?.name}</h3>
                    {/* <p className="text-xs text-gray-500">Company</p> */}
                  </div>
                </TableCell>

                <TableCell className="font-medium">{job.title}</TableCell>

                <TableCell>
                  {new Date(job.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

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

                    <PopoverContent align="end" className="w-52 p-2 rounded-xl">
                     

                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-blue-50"
                      >
                        <div className="rounded-md bg-blue-100 p-2 group-hover:bg-blue-200">
                          <Eye className="h-4 w-4 text-blue-700" />
                        </div>

                        <span className="font-medium">View Applicants</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};


