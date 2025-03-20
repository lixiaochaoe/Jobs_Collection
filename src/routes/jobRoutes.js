const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// GET all jobs
router.get('/jobs', jobController.getAllJobs);

// GET single job by id
router.get('/jobs/:id', jobController.getJobById);

// POST create new job
router.post('/jobs', jobController.createJob);

// PUT update job
router.put('/jobs/:id', jobController.updateJob);

// DELETE job
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;