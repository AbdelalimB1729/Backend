const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  const session = await Session.create(req.body);
  res.status(201).json(session);
};

exports.getSessions = async (req, res) => {
  const sessions = await Session.find().populate('film cinema');
  res.json(sessions);
};
exports.getSessionById = async (req, res) => {
  const session = await Session.findById(req.params.id).populate('film cinema');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(session);
};
exports.updateSession = async (req, res) => {
  const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('film cinema');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(session);
}
exports.deleteSession = async (req, res) => {
  const session = await Session.findByIdAndDelete(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.status(204).send();
};