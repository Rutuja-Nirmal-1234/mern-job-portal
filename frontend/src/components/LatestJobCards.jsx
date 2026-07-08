import React from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[240px] p-4 rounded-md shadow-xl bg-white border border-gray-100 flex flex-col justify-between">
      {/* Company */}
      <div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={job?.company?.logo} />
          </Avatar>

          <div className="min-w-0">
            <h1 className="font-medium text-lg line-clamp-1">
              {job?.company?.name}
            </h1>

            <p className="text-sm text-gray-500 line-clamp-1">
              {job?.location}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="mt-3">
          <h1 className="font-bold text-lg line-clamp-1">
            {job?.title}
          </h1>

          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {job?.description}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="text-blue-700 font-bold text-xs" variant="ghost">
            {job?.position} Positions
          </Badge>

          <Badge className="text-[#F83002] font-bold text-xs" variant="ghost">
            {job?.jobType}
          </Badge>

          <Badge className="text-[#7209b7] font-bold text-xs" variant="ghost">
            {job?.salary} LPA
          </Badge>
        </div>

       <Button
  onClick={() => navigate(`/description/${job?._id}`)}
  className="w-full bg-[#7209b7] hover:bg-[#5f32a8] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
>
  View Details
</Button>
      </div>
    </div>
  );
};