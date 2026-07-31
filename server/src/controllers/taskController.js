const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const isProjectMember = (project, user) => {
  if (user.role === 'Admin') return true;

  const currentUserId = user._id.toString();

  return (
    project.owner?.toString() === currentUserId ||
    (project.members || []).some(
      (member) => member.toString() === currentUserId
    )
  );
};

const isProjectOwnerOrAdmin = (project, user) => {
  return (
    user.role === 'Admin' ||
    project.owner.toString() === user._id.toString()
  );
};

const canModifyTask = (project, task, user) => {
  if (user.role === 'Admin') return true;
  if (project.owner.toString() === user._id.toString()) return true;

  const userId = user._id.toString();
  const isAssignee = task.assignee?.toString() === userId;
  const isCreator = task.creator?.toString() === userId;

  return isAssignee || isCreator;
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignee,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: 'Invalid project id',
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        message: 'Not authorized to add tasks to this project',
      });
    }

    let finalAssignee = null;
    if (assignee) {
      const canAssignOthers = isProjectOwnerOrAdmin(project, req.user);

      if (!canAssignOthers && assignee !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Members can only assign tasks to themselves',
        });
      }

      const assignedUser = await User.findById(assignee);

      if (!assignedUser) {
        return res.status(404).json({
          message: 'Assigned user not found',
        });
      }

      const allowed =
        project.owner.toString() === assignedUser._id.toString() ||
        project.members.some(
          (member) => member.toString() === assignedUser._id.toString()
        );

      if (!allowed) {
        return res.status(400).json({
          message: 'Assignee must be a member of the project',
        });
      }

      finalAssignee = assignee;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate,
      project: projectId,
      creator: req.user._id,
      assignee: finalAssignee,
    });

    await task.populate('creator', 'name email');
    await task.populate('assignee', 'name email');
    await task.populate('project', 'name');

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all accessible tasks across user projects
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    let projectIds = [];

    if (req.user.role === 'Admin') {
      const allProjects = await Project.find({}).select('_id');
      projectIds = allProjects.map((p) => p._id);
    } else {
      const accessibleProjects = await Project.find({
        $or: [
          { owner: req.user._id },
          { members: req.user._id },
        ],
      }).select('_id');
      projectIds = accessibleProjects.map((project) => project._id);
    }

    const filter = {
      project: {
        $in: projectIds,
      },
    };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignee) filter.assignee = req.query.assignee;

    if (
      req.query.projectId &&
      mongoose.Types.ObjectId.isValid(req.query.projectId)
    ) {
      filter.project = req.query.projectId;
    }

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate('creator', 'name email')
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/:projectId
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: 'Invalid project id',
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        message: 'Not authorized to view tasks for this project',
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {
      project: projectId,
    };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignee) filter.assignee = req.query.assignee;

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate('creator', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'To Do',
      'In Progress',
      'Done',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid task status',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project);

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        message: 'Not authorized to update tasks in this project',
      });
    }

    if (!canModifyTask(project, task, req.user)) {
      return res.status(403).json({
        message: 'You can only update your own assigned tasks',
      });
    }

    task.status = status;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project);

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        message: 'Not authorized to update tasks in this project',
      });
    }

    if (!canModifyTask(project, task, req.user)) {
      return res.status(403).json({
        message: 'You can only update your own assigned tasks',
      });
    }

    // Allow updating only these fields
    const allowedFields = [
      'title',
      'description',
      'status',
      'priority',
      'dueDate',
      'assignee',
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (updateData.title) {
      updateData.title = updateData.title.trim();
    }

    if (updateData.description !== undefined) {
      updateData.description = updateData.description.trim();
    }

    if (updateData.assignee === '') {
      updateData.assignee = null;
    }

    if (updateData.assignee) {
      const canAssignOthers = isProjectOwnerOrAdmin(project, req.user);

      if (!canAssignOthers && updateData.assignee !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Members can only assign tasks to themselves',
        });
      }

      const assignedUser = await User.findById(updateData.assignee);

      if (!assignedUser) {
        return res.status(404).json({
          message: 'Assigned user not found',
        });
      }

      const allowed =
        project.owner.toString() === assignedUser._id.toString() ||
        project.members.some(
          (member) => member.toString() === assignedUser._id.toString()
        );

      if (!allowed) {
        return res.status(400).json({
          message: 'Assignee must be a member of the project',
        });
      }
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('creator', 'name email')
      .populate('assignee', 'name email')
      .populate('project', 'name');

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project);

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        message: 'Not authorized to delete tasks in this project',
      });
    }

    if (!canModifyTask(project, task, req.user)) {
      return res.status(403).json({
        message: 'You can only delete your own assigned tasks',
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};