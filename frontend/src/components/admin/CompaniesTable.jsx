import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";   // ✅ Add this
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company,
  );
  // const companies = companyState?.companies ?? [];

  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }

        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  return (
  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
    <Table>
      <TableCaption className="py-4 text-gray-500">
        Manage all your registered companies
      </TableCaption>

      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          <TableHead className="pl-6">Company</TableHead>
          <TableHead>Created On</TableHead>
          <TableHead className="text-right pr-6">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filterCompany.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="py-16 text-center"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  🏢
                </div>

                <h2 className="font-semibold text-lg">
                  No Companies Found
                </h2>

                <p className="text-sm text-gray-500">
                  Register your first company to start posting jobs.
                </p>

                <Button
                  className="mt-2"
                  onClick={() => navigate("/admin/companies/create")}
                >
                  + Create Company
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-violet-50 transition-colors"
            >
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border shadow-sm">
                    <AvatarImage
                      src={company.logo}
                      className="object-cover"
                    />

                    <AvatarFallback className="bg-violet-100 text-violet-700 font-bold text-lg">
                      {company?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold text-base text-gray-900">
                      {company.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Company Profile
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                {new Date(company.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell className="text-right pr-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-violet-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-40 p-2"
                    align="end"
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-violet-50 transition"
                    >
                      <Edit2 className="h-4 w-4 text-violet-600" />
                      Edit Company
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
};



