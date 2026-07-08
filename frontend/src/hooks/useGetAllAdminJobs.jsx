import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllAdminJobs } from "@/redux/jobSlice";

export const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/getadmin`,
          {
            withCredentials: true,
          }
        );

console.log("API Response:", res.data);
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);
};