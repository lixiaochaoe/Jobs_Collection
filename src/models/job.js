// Job model for interacting with jobs data in the database
const db = require('../config/db');
require('dotenv').config();

// Table name from environment variables with fallback
const TABLE_NAME = process.env.TABLE_NAME || 'jobs';

class Job {
  // Get all jobs
  static async getAll() {
    try {
      const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME}`);
      return rows;
    } catch (error) {
      console.error('Error querying jobs:', error.message);
      throw error;
    }
  }

  // Get a single job by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error querying job with id ${id}:`, error.message);
      throw error;
    }
  }

  // Create a new job
  static async create(jobData) {
    try {
      const [result] = await db.query(`INSERT INTO ${TABLE_NAME} SET ?`, [jobData]);
      return result.insertId;
    } catch (error) {
      console.error('Error creating job:', error.message);
      throw error;
    }
  }

  // Update an existing job
  static async update(id, jobData) {
    try {
      const [result] = await db.query(`UPDATE ${TABLE_NAME} SET ? WHERE id = ?`, [jobData, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating job with id ${id}:`, error.message);
      throw error;
    }
  }

  // Delete a job
  static async delete(id) {
    try {
      const [result] = await db.query(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting job with id ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = Job;