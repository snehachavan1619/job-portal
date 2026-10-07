const { Op } = require("sequelize");

const Job = require("../models/Job");
const Company = require("../models/Company");


// Get jobs with search, filters, sorting and pagination
const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      workMode,
      minExperience,
      maxExperience,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {
      status: "ACTIVE",
    };

    // Keyword search
    if (keyword) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    // Location filter
    if (location) {
      where.location = {
        [Op.like]: `%${location}%`,
      };
    }

    // Job type filter
    if (jobType) {
      where.job_type = jobType;
    }

    // Work mode filter
    if (workMode) {
      where.work_mode = workMode;
    }

    // Experience filter
    if (minExperience) {
      where.min_experience = {
        [Op.gte]: Number(minExperience),
      };
    }

    if (maxExperience) {
      where.max_experience = {
        [Op.lte]: Number(maxExperience),
      };
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.min(
      Math.max(Number(limit), 1),
      50
    );

    const offset = (currentPage - 1) * pageLimit;

    // Sorting
    let order = [["createdAt", "DESC"]];

    if (sort === "oldest") {
      order = [["createdAt", "ASC"]];
    }

    if (sort === "salary_high") {
      order = [["max_salary", "DESC"]];
    }

    if (sort === "salary_low") {
      order = [["min_salary", "ASC"]];
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          attributes: [
            "id",
            "company_name",
            "industry",
            "location",
            "logo",
          ],
        },
      ],
      order,
      limit: pageLimit,
      offset,
    });

    res.status(200).json({
      success: true,

      pagination: {
        totalJobs: count,
        currentPage,
        totalPages: Math.ceil(count / pageLimit),
        limit: pageLimit,
      },

      jobs: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get single job
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: {
        id,
        status: "ACTIVE",
      },
      include: [
        {
          model: Company,
          attributes: [
            "id",
            "company_name",
            "description",
            "industry",
            "website",
            "location",
            "logo",
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  getJobs,
  getJobById,
};