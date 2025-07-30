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

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation des champs requis
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs (nom, email, mot de passe) sont requis' });
    }

    // Vérification de l'unicité de l'email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Création du nouvel utilisateur
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Retourne l'utilisateur sans le mot de passe
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};