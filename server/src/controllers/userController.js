const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// جلب كل المستخدمين مع الباجينيشن (لـ Admin فقط)
exports.getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({});
    const users = await User.find({})
      .select('name email role')
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// جلب تفاصيل مستخدم معين مع مشاريعه ومهامه (لـ Admin فقط)
exports.getUserDetailsForAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const targetUser = await User.findById(userId).select('-password');
    
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // جلب المشاريع التي يمتلكها أو مشارك فيها
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).populate('owner members', 'name email');

    // جلب المهام المسندة إليه
    const tasks = await Task.find({ assignee: userId }).populate('project', 'name');

    return res.status(200).json({
      success: true,
      data: {
        user: targetUser,
        projects,
        tasks
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};