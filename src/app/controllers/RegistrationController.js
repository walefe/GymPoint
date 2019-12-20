import { isBefore, parseISO, addMonths } from 'date-fns';
import * as Yup from 'yup';

import Student from '../models/Students';
import User from '../models/User';
import Plan from '../models/Plans';
import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const userAdmin = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!userAdmin) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }

    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { start_date, student_id, plan } = req.body;

    /**
     * Check user is Admin
     */
    const userAdmin = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!userAdmin) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }

    /**
     * Check Student exist
     */

    const studentExist = await Student.findOne({ where: { id: student_id } });

    if (!studentExist) {
      return res.status(401).json({ error: 'Student not found.' });
    }

    const { id: planId, duration, price } = await Plan.findOne({
      where: { title: plan },
    });

    /**
     * Check initial Date and calculate end register.
     */
    const dateStart = parseISO(start_date);

    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const endDate = addMonths(dateStart, duration);

    /**
     * Check exists registration
     */

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });

    if (registrationExists) {
      return res
        .status(401)
        .json({ error: 'Register already exists for student.' });
    }

    const registration = await Registration.create({
      student_id,
      plan_id: planId,
      start_date: dateStart,
      end_date: endDate,
      price,
    });

    return res.json(registration);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    const user = await User.findOne({
      where: { id: req.userId, instructor: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'User must be an administrator.' });
    }

    if (!registration) {
      return res.json({ error: 'Registration not found.' });
    }

    await Registration.destroy({ where: { id: registration.id } });

    return res.json().status(200);
  }
}

export default new RegistrationController();
