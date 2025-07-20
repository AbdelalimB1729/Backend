const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};


exports.blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
  res.json(user);
};

exports.updateUserRole = async (req, res) => {
  const role = req.query.role; 
  const allowedRoles = ['user', 'admin'];

  if (!role) {
    return res.status(400).json({ error: 'Merci de fournir un rôle dans la query string (ex: ?role=admin)' });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: `Rôle invalide. Rôles acceptés: ${allowedRoles.join(', ')}` });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
