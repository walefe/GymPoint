import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Students from '../models/Students';
import Checkins from '../models/Checkins';

class CheckinsController {
  async index(req, res) {
    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const studentCheckins = await Checkins.findAll({
      where: { student_id: id },
    });

    return res.json(studentCheckins);
  }

  async store(req, res) {
    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const daysAvailable = subDays(new Date(), 7);

    const weekCheckins = await Checkins.findAll({
      where: {
        student_id: studentExists.id,
        created_at: {
          [Op.between]: [daysAvailable, new Date()],
        },
      },
    });

    if (weekCheckins.length >= 5) {
      return res
        .status(401)
        .json({ error: 'you have already reached the limit of 5 checkins' });
    }

    const creatCheckin = await Checkins.create({
      student_id: studentExists.id,
    });

    return res.json(creatCheckin);
  }
}

export default new CheckinsController();
