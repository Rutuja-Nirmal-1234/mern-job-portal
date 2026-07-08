import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { useSelector } from "react-redux";

export const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  // Remove applications whose job has been deleted
  const validApplications =
    allAppliedJobs?.filter((item) => item.job !== null) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 hover:bg-green-100";

      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";

      default:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableCaption className="py-3">
          A list of your applied jobs
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Logo</TableHead>

            <TableHead>Company</TableHead>

            <TableHead>Job Role</TableHead>

            <TableHead>Applied On</TableHead>

            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {validApplications.length > 0 ? (
            validApplications.map((item) => (
              <TableRow
                key={item._id}
                className="hover:bg-gray-50 border-b"
              >
                {/* Company Logo */}
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={item.job?.company?.logo}
                      alt={item.job?.company?.name}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {item.job?.company?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                {/* Company Name */}
                <TableCell className="font-medium">
                  {item.job?.company?.name}
                </TableCell>

                {/* Job Role */}
                <TableCell>
                  {item.job?.title}
                </TableCell>

                {/* Applied Date */}
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-gray-500"
              >
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};