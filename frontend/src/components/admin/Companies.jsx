import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CompaniesTable } from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import { useGetAllCompanies } from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

export const Companies = () => {
  useGetAllCompanies();

  const [input,setInput] = useState("");


  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(()=>{
    dispatch(setSearchCompanyByText(input));
  },[input]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Companies
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your registered companies from one place.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/companies/create")}
          className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full md:w-auto"
        >
          + New Company
        </Button>
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Input
            className="w-full md:w-96"
            placeholder="🔍 Search company by name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <CompaniesTable />
      </div>
    </div>
  </div>
);
};
