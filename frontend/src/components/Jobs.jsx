import React, { useEffect, useState } from "react";
import Navbar from "./shared/navbar";
import { FilterCard } from "./FilterCard";
import { Job } from "./Job";
import { Footer } from "./Footer";
import { useSelector } from "react-redux";
import { useGetAllJobs } from "@/hooks/useGetAllJobs";

// e.g. "3-6 LPA" -> [3, 6]   |   "40+ LPA" -> [40, Infinity]
const getSalaryRange = (rangeStr) => {
  const isOpenEnded = rangeStr.includes("+");

  // string se sirf numbers nikaalo (LPA, spaces, +, - sab ignore)
  const numbers = rangeStr.match(/\d+(\.\d+)?/g)?.map(Number) || [];

  if (isOpenEnded) {
    return [numbers[0] ?? 0, Infinity];
  }

  return [numbers[0] ?? 0, numbers[1] ?? Infinity];
};

// spaces/hyphens hata ke lowercase karega
const normalize = (str) => str?.toLowerCase().replace(/[\s-]/g, "") || "";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    const { type, value } = searchedQuery || {};

    if (value) {
      const filteredJobs = allJobs.filter((job) => {
        if (type === "Location") {
          return job.location?.toLowerCase().includes(value.toLowerCase());
        }

        if (type === "Industry") {
          return normalize(job.title).includes(normalize(value));
        }

        if (type === "Salary") {
          const [min, max] = getSalaryRange(value);
          const jobSalary = Number(job.salary) || 0; // job.salary LPA mein hai
          return jobSalary >= min && jobSalary <= max;
        }

        return (
          job.title?.toLowerCase().includes(value.toLowerCase()) ||
          job.description?.toLowerCase().includes(value.toLowerCase()) ||
          job.location?.toLowerCase().includes(value.toLowerCase())
        );
      });

      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-1/5 border rounded-md p-4">
            <FilterCard />
          </div>

         {/* Jobs Section */}
<div className="flex-1">
  {filterJobs.length <= 0 ? (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="text-6xl mb-4">🔍</div>

      <h2 className="text-xl font-semibold text-gray-800">
        No Jobs Found
      </h2>

      <p className="text-gray-500 mt-2 max-w-sm">
        We couldn't find any jobs matching your filters. Try adjusting or
        clearing your filters to see more results.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filterJobs.map((job) => (
        <Job key={job._id} job={job} />
      ))}
    </div>
  )}
</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;