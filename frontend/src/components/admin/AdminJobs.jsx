import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import { AdminJobsTable } from "./AdminJobsTable";
import { useGetAllAdminJobs } from "@/hooks/useGetAllAdminJobs";

export const AdminJobs = () => {
  useGetAllAdminJobs();

  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Jobs
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage all jobs posted by you.
            </p>
          </div>

          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            + Post New Job
          </Button>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

          <div className="flex justify-between items-center mb-6">

            <Input
              className="max-w-md"
              placeholder="🔍 Search by company or role..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

          </div>

          <AdminJobsTable />

        </div>

      </div>
    </div>
  );
};