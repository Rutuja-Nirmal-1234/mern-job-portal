import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { Building2 } from "lucide-react";

export const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");

  const registerNewCompany = async () => {
    if (!companyName || companyName.trim() === "") {
      toast.error("Please enter your company name.");
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);

        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6A38C2] to-[#7F56D9] px-8 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Building2 size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Create Your Company
                </h1>

                <p className="text-sm text-gray-100 mt-1">
                  Enter your company name to get started. You can update all
                  company details later.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="space-y-2">
              <Label className="font-semibold">
                Company Name
              </Label>

              <Input
                type="text"
                value={companyName}
                placeholder="Microsoft, Google, Infosys..."
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11"
              />

              <p className="text-sm text-gray-500">
                This name will be visible to candidates on your company profile.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={registerNewCompany}
                className="w-full sm:w-auto bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};