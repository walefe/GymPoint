import User from '../models/User';
import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    const user = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }
    const helpOrders = await HelpOrders.findAll({ where: { answer: null } });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const user = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }

    const { id } = req.params;

    const helpOrderExists = await HelpOrders.findByPk(id);

    if (!helpOrderExists) {
      return res.status(400).json({ error: 'Help order not found.' });
    }

    const { answer } = req.body;
    const answer_at = new Date();

    const answerHelpOrder = await helpOrderExists.update({ answer, answer_at });

    return res.json(answerHelpOrder);
  }
}

export default new HelpOrdersController();
