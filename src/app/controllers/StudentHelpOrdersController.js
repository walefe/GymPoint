import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

class StudentHelpOrdersController {
  async index(req, res) {
    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const helpOrders = await HelpOrders.findAll({ where: { student_id: id } });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrders.create({ student_id: id, question });

    return res.json(helpOrder);
  }
}

export default new StudentHelpOrdersController();
