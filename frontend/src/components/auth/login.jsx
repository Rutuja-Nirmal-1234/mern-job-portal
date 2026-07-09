import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  // Validation Errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });

    // Remove error while typing/selecting
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!input.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!input.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    // Stop API if validation fails
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
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
          className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl border border-violet-100 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-violet-700">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Login to continue your journey
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <Label className="font-medium">Email</Label>

            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className={`mt-2 h-11 transition ${
                errors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-2 focus-visible:ring-violet-500"
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label className="font-medium">Password</Label>

            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className={`mt-2 h-11 transition ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-2 focus-visible:ring-violet-500"
              }`}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <Label className="font-medium">Login As</Label>

            <RadioGroup className="flex gap-4 mt-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                  input.role === "student"
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-sm"
                    : "border-gray-300 hover:border-violet-400 hover:bg-violet-50"
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

                <span className="font-medium">Candidate</span>
              </label>

              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                  input.role === "recruiter"
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-sm"
                    : "border-gray-300 hover:border-violet-400 hover:bg-violet-50"
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

                <span className="font-medium">Recruiter</span>
              </label>
            </RadioGroup>

            {errors.role && (
              <p className="text-red-500 text-xs mt-2">
                {errors.role}
              </p>
            )}
          </div>

          {/* Button */}
          {loading ? (
            <Button
              disabled
              className="w-full h-11 bg-violet-600 hover:bg-violet-700"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-11 bg-violet-500 hover:bg-violet-700 text-white font-semibold shadow-lg"
            >
              Login
            </Button>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-violet-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;