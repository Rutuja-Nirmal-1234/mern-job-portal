import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("SIGNUP DATA:", input);

    // ✅ VALIDATION (BEFORE API CALL)
    const newErrors = {};

    if (!input.fullname.trim()) {
      newErrors.fullname = "Please enter your full name";
    }

    if (!input.email.trim()) {
      newErrors.email = "Please enter your email";
    }

    if (!input.password.trim()) {
      newErrors.password = "Please enter your password";
    }

    if (!input.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);

      // Phone Number Optional
      if (input.phoneNumber.trim()) {
        formData.append("phoneNumber", input.phoneNumber);
      }

      formData.append("password", input.password);
      formData.append("role", input.role);

      if (input.file) {
        formData.append("file", input.file);
      }

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-100">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-[550px] bg-white rounded-2xl shadow-2xl border border-violet-100 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-violet-700">Create Account</h1>
            <p className="text-gray-500 mt-2">
              Join us and find your dream job 🚀
            </p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <Label className="font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className={`mt-2 h-11 ${
                errors.fullname
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-2 focus-visible:ring-violet-500"
              }`}
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={input.fullname}
              onChange={changeEventHandler}
            />
            {errors.fullname && (
              <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label className="font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              className={`mt-2 h-11 ${
                errors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-2 focus-visible:ring-violet-500"
              }`}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={input.email}
              onChange={changeEventHandler}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <Label className="font-medium">
              Phone Number
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label>
            <Input
              className="mt-2 h-11 focus-visible:ring-2 focus-visible:ring-violet-500"
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={input.phoneNumber}
              onChange={changeEventHandler}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label className="font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              className={`mt-2 h-11 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-2 focus-visible:ring-violet-500"
              }`}
              type="password"
              name="password"
              placeholder="Enter password"
              value={input.password}
              onChange={changeEventHandler}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-5">
            <Label className="font-medium">
              Select Role <span className="text-red-500">*</span>
            </Label>

            <div className="flex gap-4 mt-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition ${
                  input.role === "student"
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-gray-300 hover:border-violet-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="accent-violet-600"
                />
                Candidate
              </label>

              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition ${
                  input.role === "recruiter"
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-gray-300 hover:border-violet-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="accent-violet-600"
                />
                Recruiter
              </label>
            </div>

            {errors.role && (
              <p className="text-red-500 text-xs mt-2">{errors.role}</p>
            )}
          </div>

          {/* Profile */}
          <div className="mb-6">
            <Label className="font-medium">
              Profile Photo
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label>
            <Input
              className="mt-2 cursor-pointer file:mr-4 file:rounded-lg file:border-0  file:px-4  file:text-violet-700 hover:file:bg-violet-200"
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
            />
          </div>

          {loading ? (
            <Button
              disabled
              className="w-full h-11 bg-violet-600 hover:bg-violet-700"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-11 bg-violet-500 hover:bg-violet-700 text-white font-semibold"
            >
              Sign Up
            </Button>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;