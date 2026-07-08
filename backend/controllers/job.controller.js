import {Job} from "../models/job.model.js"
import { Application } from "../models/application.model.js";
/// admin post
export const postJob = async (req,res)=>{

  try{

    const {title,description,requirements,salary,location,jobType,experience,position,companyId} = req.body;
    const userId = req.id;

    if(!title  || !description || !requirements || !salary ||!location || !jobType || !experience || !position  ||!companyId){
      return res.status(400).json({
        message : "Something is missing",
        success:false
      })
    };

    const job = await Job.create({
        title,
      description,
      requirements : requirements.split(","),
      salary : Number(salary),
      location,
      jobType,
      experienceLevel:experience,
      position,
      company:companyId,
      created_by:userId
    });

    return res.status(200).json({
        message : "New job create successfully",
        job,
        success:true
      })

  }catch(error){
    console.log(error);
  }

}

/// student
export const getAllJob = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();

    // Make search flexible
    const regexKeyword = keyword
      .replace(/frontend/gi, "front[- ]?end")
      .replace(/backend/gi, "back[- ]?end")
      .replace(/fullstack/gi, "full[- ]?stack");

    const query = {
      $or: [
        {
          title: {
            $regex: regexKeyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: regexKeyword,
            $options: "i",
          },
        },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



/// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "company",
      })
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
        },
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};


export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: jobId });

    // Delete job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};


