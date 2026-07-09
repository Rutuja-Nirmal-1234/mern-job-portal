import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

export const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();

    const timeDifference = currentTime - createdAt;

    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
  <div className="h-[320px] p-5 rounded-md shadow-xl bg-white border border-gray-200 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
        </p>

        {/* <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button> */}
      </div>

      <div className="flex items-center gap-2 my-3">
        <Avatar>
          <AvatarImage src={job?.company?.logo} />
        </Avatar>

        <div className="min-w-0">
          <h1 className="font-medium text-lg line-clamp-1">
            {job?.company?.name}
          </h1>

          <p className="text-sm text-gray-600 line-clamp-1">
            {job?.location}
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2 line-clamp-2">
          {job?.title}
        </h1>

        <p className="text-sm text-gray-600 line-clamp-3">
          {job?.description}
        </p>
      </div>
    </div>

    <div>
      <div className="flex flex-wrap gap-2 mt-4">
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

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>

        {/* <Button className="bg-[#7209b7] hover:bg-[#5f32a8]">
          Save For Later
        </Button> */}
      </div>
    </div>
  </div>
);
};
