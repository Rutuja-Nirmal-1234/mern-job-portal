import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });

    if (name === "position") {
      if (value.startsWith("-")) {
        setPositionError("Number of positions cannot be negative");
      } else {
        setPositionError("");
      }
    }

    if (name === "salary") {
      if (value.startsWith("-")) {
        setSalaryError("Salary cannot be negative");
      } else {
        setSalaryError("");
      }
    }
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value,
    );

    setInput({
      ...input,
      companyId: selectedCompany?._id,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      toast.error("Please select a company");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const [positionError, setPositionError] = useState("");
  const [salaryError, setSalaryError] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Post a New Job</h1>

            <p className="text-gray-500 mt-2">
              Fill in all the required details to publish a new job opening.
            </p>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Job Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="Frontend Developer"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Job Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Enter job description"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="React, Node.js, MongoDB..."
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Salary (LPA)</Label>

              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="10"
                className={`mt-2 ${
                  salaryError ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                required
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />

              {salaryError && (
                <p className="text-sm text-red-600 mt-1">{salaryError}</p>
              )}
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Pune"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full Time"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="2 Years"
                className="mt-2"
                required
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <Label>No. of Positions</Label>

              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                placeholder="5"
                className={`mt-2 ${
                  positionError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                required
                min="0"
              />

              {positionError && (
                <p className="text-sm text-red-600 mt-1">{positionError}</p>
              )}
            </div>

            {companies.length > 0 && (
              <div className="md:col-span-2">
                <Label>
                  Select Company <span className="text-red-500">*</span>
                </Label>

                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Choose a company" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* No Company Available */}
            {companies.length === 0 && (
              <div className="md:col-span-2">
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <h2 className="text-lg font-semibold text-red-600">
                    No Company Found
                  </h2>

                  <p className="text-sm text-red-500 mt-2">
                    You need to create a company before posting a job.
                  </p>

                  <Button
                    type="button"
                    onClick={() => navigate("/admin/companies/create")}
                    className="mt-4 bg-red-600 hover:bg-red-700"
                  >
                    Create Company
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            {loading ? (
              <Button
                disabled
                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Job...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  companies.length === 0 || !!positionError || !!salaryError
                }
                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] h-11 text-base font-semibold transition-all duration-300"
              >
                Post New Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
