import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export const CompanySetup = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const params = useParams();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];

    setInput({
      ...input,
      file,
    });
  };

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${params.id}`,
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          setInput({
            name: res.data.company.name || "",
            description: res.data.company.description || "",
            website: res.data.company.website || "",
            location: res.data.company.location || "",
            file: null,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    fetchSingleCompany();
  }, [params.id]);
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] px-8 py-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">Company Setup</h1>

                <p className="text-purple-100 mt-2 max-w-lg">
                  Complete your company profile so candidates can know more
                  about your organization.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-fit flex items-center gap-2 bg-white text-[#6A38C2] hover:bg-gray-100"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />
                Back
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Name */}
              <div>
                <Label className="mb-2 block font-semibold text-gray-700">
                  Company Name
                </Label>

                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Microsoft"
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Website */}
              <div>
                <Label className="mb-2 block font-semibold text-gray-700">
                  Website
                </Label>

                <Input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="https://company.com"
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2 block font-semibold text-gray-700">
                  Description
                </Label>

                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Tell candidates about your company"
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Location */}
              <div>
                <Label className="mb-2 block font-semibold text-gray-700">
                  Location
                </Label>

                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="Pune, Maharashtra"
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Logo Upload */}
              <div className="md:col-span-2">
                <Label className="block mb-3 font-semibold text-gray-700">
                  Company Logo
                </Label>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#6A38C2] transition-all">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="cursor-pointer"
                  />

                  <p className="text-sm font-medium text-gray-700 mt-4">
                    Upload a new company logo{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    If you don't upload a new logo, your current logo will
                    remain unchanged.
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Supports PNG, JPG and JPEG (Recommended size: 512 × 512 px)
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
              >
                Cancel
              </Button>

              {loading ? (
                <Button disabled className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[#6A38C2] hover:bg-[#5b30a6]"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
