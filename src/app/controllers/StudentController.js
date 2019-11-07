import * as Yup from 'yup';

import Student from '../models/Students';
import User from '../models/User';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails!' });
    }

    const user = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }

    const { name, email, age, weight, height } = req.body;

    const student = await Student.create({
      name,
      email,
      age,
      weight,
      height,
      instructor_id: req.userId,
    });

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    const student = await Student.findOne({ where: { id } });

    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    await student.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
