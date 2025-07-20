const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password , role} = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Tous les champs sont requis' });

    if (await User.exists({ email }))
      return res.status(409).json({ message: 'Email déjà utilisé' });

    await User.create({ name, email, password , role});
    return res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    next(err);
  }
};

// 2. Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: '1h' });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

// 3. Forgot password - Send email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requis' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // expire in 10 mins
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"CineSphere" <no-reply@cinesphere.com>',
      to: user.email,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Clique sur ce lien pour réinitialiser ton mot de passe :</p>
        <a href="${resetURL}">${resetURL}</a>
        <p><strong>Le lien est valable pendant 10 minutes.</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 4. Reset password - with token
exports.resetPasswordToken = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: 'Nouveau mot de passe requis' });

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Lien invalide ou expiré' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
