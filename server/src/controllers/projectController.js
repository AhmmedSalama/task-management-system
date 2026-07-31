const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

const normalizeMemberIds = (members = []) => {
  const ids = (members || [])
    .filter(Boolean)
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  return [...new Map(ids.map((id) => [id.toString(), id])).values()];
};

const getOwnerId = (owner) => {
  if (!owner) return '';
  if (owner._id) return owner._id.toString();
  return owner.toString();
};

const getMemberId = (member) => {
  if (!member) return '';
  if (member._id) return member._id.toString();
  return member.toString();
};

const isProjectMember = (project, user) => {
  if (user.role === 'Admin') return true;

  const currentUserId = user._id.toString();
  const ownerId = getOwnerId(project.owner);

  if (ownerId === currentUserId) {
    return true;
  }

  return (project.members || []).some(
    (member) => getMemberId(member) === currentUserId
  );
};

const isProjectOwnerOrAdmin = (project, user) => {
  const ownerId = getOwnerId(project.owner);
  return (
    user.role === 'Admin' ||
    ownerId === user._id.toString()
  );
};

// @desc    Create a new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    const memberIds = normalizeMemberIds(members);

    const filteredMembers = memberIds.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    if (filteredMembers.length > 0) {
      const usersCount = await User.countDocuments({
        _id: { $in: filteredMembers },
      });

      if (usersCount !== filteredMembers.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more members do not exist',
        });
      }
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      owner: req.user._id,
      members: filteredMembers,
    });

    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all accessible projects (Admin sees all, others see own/member projects)
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.user.role !== 'Admin') {
      filter = {
        $or: [
          { owner: req.user._id },
          { members: req.user._id },
        ],
      };
    }

    // Search
    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: 'i',
      };
    }

    // Sorting
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({
        [sortField]: sortOrder,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project id',
      });
    }

    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isProjectOwnerOrAdmin(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    const { name, description } = req.body;

    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();

    await project.save();

    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isProjectOwnerOrAdmin(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Add member to a project
// @route   POST /api/projects/:id/members
exports.addMember = async (req, res) => {
  try {
    const { userId, email } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isProjectOwnerOrAdmin(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members',
      });
    }

    let user;

    if (email) {
      user = await User.findOne({
        email: email.toLowerCase().trim(),
      });
    } else if (userId) {
      user = await User.findById(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'User id or email is required',
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (getOwnerId(project.owner) === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Project owner is already associated with the project',
      });
    }

    if (project.members.some((m) => getMemberId(m) === user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    project.members.push(user._id);

    await project.save();

    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Remove member from a project
// @route   DELETE /api/projects/:id/members/:userId
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!isProjectOwnerOrAdmin(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members',
      });
    }

    if (getOwnerId(project.owner) === userId) {
      return res.status(400).json({
        success: false,
        message: 'Project owner cannot be removed',
      });
    }

    if (!project.members.some((m) => getMemberId(m) === userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this project',
      });
    }

    project.members = project.members.filter(
      (member) => getMemberId(member) !== userId
    );

    await project.save();

    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};