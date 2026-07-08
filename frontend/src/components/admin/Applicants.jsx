import React, { useEffect } from "react";
import Navbar from "../shared/navbar";
import { ApplicantsTable } from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";

export const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicats = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllApplicats();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Applicants
          </h1>

          <p className="text-gray-500 mt-1">
            Total Applicants :{" "}
            <span className="font-semibold text-black">
              {applicants?.applications?.length || 0}
            </span>
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-md border p-6">
          <ApplicantsTable />
        </div>
      </div>
    </>
  );
};