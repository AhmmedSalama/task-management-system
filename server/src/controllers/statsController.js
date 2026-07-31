const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats
exports.getDashboardStats = async (req, res) => {
  try {
    let projectsFilter = {};
    let tasksFilter = {};

    if (req.user.role !== 'Admin') {
      const accessibleProjects = await Project.find({
        $or: [
          { owner: req.user._id },
          { members: req.user._id },
        ],
      }).select('_id');

      const projectIds = accessibleProjects.map((p) => p._id);
      projectsFilter = { _id: { $in: projectIds } };
      tasksFilter = { project: { $in: projectIds } };
    }

    const totalProjects = await Project.countDocuments(projectsFilter);
    const totalTasks = await Task.countDocuments(tasksFilter);
    
    const todoTasks = await Task.countDocuments({ ...tasksFilter, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...tasksFilter, status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ ...tasksFilter, status: 'Done' });

    let totalUsers = 0;
    if (req.user.role === 'Admin') {
      totalUsers = await User.countDocuments({});
    }

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        totalUsers: req.user.role === 'Admin' ? totalUsers : undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};