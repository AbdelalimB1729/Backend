const Ticket = require('../models/Ticket');

exports.bookTicket = async (req, res) => {
  const ticket = await Ticket.create({ ...req.body, user: req.user.id });
  res.status(201).json(ticket);
};

exports.getUserTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id }).populate('session');
  res.json(tickets);
};
exports.getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('session');
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.json(ticket);
};
exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('session');
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.json(ticket);
}
exports.deleteTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.status(204).send();
};