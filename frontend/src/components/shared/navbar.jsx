import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User2, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(setUser(null));
      navigate("/");
      toast.success(res.data.message || "Logout successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-6xl h-16 px-4">
        {/* Logo */}
        <div>
          <Link to="/"><h1 className="text-2xl font-bold cursor-pointer">Job<span className="text-[#F83002]">Portal</span></h1></Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer"><AvatarImage src={user?.profile?.profilePhoto} /><AvatarFallback className="bg-gray-200"><User2 className="h-5 w-5 text-gray-500" /></AvatarFallback></Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4">
                  <Avatar><AvatarImage src={user?.profile?.profilePhoto} /><AvatarFallback className="bg-gray-200"><User2 className="h-5 w-5 text-gray-500" /></AvatarFallback></Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col mt-3 text-gray-600">
                  {user && user.role === "student" && (
                    <div className="flex items-center gap-2">
                      <User2 />
                      <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-5 border-t">
          <ul className="flex flex-col gap-4 mt-4 font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link></li>
                <li><Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
                <li><Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link></li>
                <li><Link to="/browse" onClick={() => setOpen(false)}>Browse</Link></li>
              </>
            )}
          </ul>

          {user && (
            <div className="flex flex-col mt-5 gap-3">
              <div className="flex items-center gap-3">
                <Avatar><AvatarImage src={user?.profile?.profilePhoto} /><AvatarFallback className="bg-gray-200"><User2 className="h-5 w-5 text-gray-500" /></AvatarFallback></Avatar>
                <div>
                  <h4 className="font-medium">{user?.fullname}</h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col text-gray-600">
                {user && user.role === "student" && (
                  <div className="flex items-center gap-2">
                    <User2 />
                    <Button variant="link"><Link to="/profile" onClick={() => setOpen(false)}>View Profile</Link></Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <LogOut />
                  <Button onClick={() => { setOpen(false); logoutHandler(); }} variant="link">Logout</Button>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
              <Link to="/signup" onClick={() => setOpen(false)}><Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;