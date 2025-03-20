// Import the Job model
const Job = require('../models/job');

// Controller methods for job operations
const jobController = {
  // Get all jobs
  getAllJobs: async (req, res) => {
    try {
      const jobs = await Job.getAll();
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    } catch (error) {
      console.error('Error in getAllJobs controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get a single job by ID
  getJobById: async (req, res) => {
    try {
      const id = req.params.id;
      const job = await Job.getById(id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: `Job with id ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error(`Error in getJobById controller:`, error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Create a new job
  createJob: async (req, res) => {
    try {
      const jobData = req.body;
      
      // Basic validation
      if (!jobData.title || !jobData.company) {
        return res.status(400).json({
          success: false,
          message: 'Please provide job title and company'
        });
      }

      const newJobId = await Job.create(jobData);
      
      return res.status(201).json({
        success: true,
        message: 'Job created successfully',
        jobId: newJobId
      });
    } catch (error) {
      console.error('Error in createJob controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update an existing job
  updateJob: async (req, res) => {
    try {
      const id = req.params.id;
      const jobData = req.body;
      
      // Check if job exists
      const existingJob = await Job.getById(id);
      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: `Job with id ${id} not found`
        });
      }

      const updated = await Job.update(id, jobData);
      
      return res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        updated: updated
      });
    } catch (error) {
      console.error(`Error in updateJob controller:`, error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Delete a job
  deleteJob: async (req, res) => {
    try {
      const id = req.params.id;
      
      // Check if job exists
      const existingJob = await Job.getById(id);
      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: `Job with id ${id} not found`
        });
      }

      const deleted = await Job.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Job deleted successfully',
        deleted: deleted
      });
    } catch (error) {
      console.error(`Error in deleteJob controller:`, error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = jobController;