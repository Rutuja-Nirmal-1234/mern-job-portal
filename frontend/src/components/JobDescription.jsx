import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// helper: applicant populated object ho ya plain id string, dono case handle karega
const isSameUser = (applicant, userId) => {
  if (!applicant || !userId) return false;
  const applicantId =
    typeof applicant === "object" ? applicant._id : applicant;
  return applicantId === userId;
};

export const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;

  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isIntiallyApplied =
    singleJob?.applications?.some((application) =>
      isSameUser(application?.applicant, user?._id)
    ) || false;

  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    // ✅ Login check sabse pehle — guest ko API call se pehle hi rok do
    if (!user) {
      toast.error("Please login first to apply for this job");
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsApplied(true); // update the local state

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...singleJob.applications,
              {
                applicant: {
                  _id: user._id,
                },
              },
            ],
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some((application) =>
              isSameUser(application.applicant, user?._id)
            )
          ); // ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="text-blue-700 font-bold text-xs" variant="ghost">
              {singleJob?.position} Positions
            </Badge>

            <Badge className="text-[#F83002] font-bold text-xs" variant="ghost">
              {singleJob?.jobType}
            </Badge>

            <Badge className="text-[#7209b7] font-bold text-xs" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={applyJobHandler}
          disabled={isApplied}
          className={
            isApplied
              ? "bg-green-100 text-green-700 border border-green-300 rounded-full px-6 cursor-not-allowed hover:bg-green-100"
              : "bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-full px-8"
          }
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="font-bold border-b-2 border-b-gray-200 py-4">
        Job Description
      </h1>

      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel} years
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Total Applications:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>

        <h1 className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt?.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};