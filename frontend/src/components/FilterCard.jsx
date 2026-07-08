import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterdata = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Banglore", "HydraBad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Data Science",
      "Graphic Designer",
      "FullStack Developer",
    ],
  },
  {
    filterType: "Salary",
    array: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-20 LPA", "20-40 LPA", "40+ LPA"],
  },
];

export const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const ChangeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    let type = "";

    filterdata.forEach((data) => {
      if (data.array.includes(selectedValue)) {
        type = data.filterType;
      }
    });

    dispatch(setSearchedQuery({ type, value: selectedValue }));
  }, [selectedValue]);

  return (
    <div>
      <h1 className="font-bold text-lg">Filter Jobs</h1>

      <hr className="my-3" />

      <RadioGroup onValueChange={ChangeHandler} value={selectedValue}>
        {filterdata.map((data, index) => (
          <div key={index} className="mb-4 font-bold text-lg">
            <h1 className="font-medium mb-2">{data.filterType}</h1>

            {data.array.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 mb-2 text-gray-700"
              >
                <RadioGroupItem value={item} />
                <Label className="cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};