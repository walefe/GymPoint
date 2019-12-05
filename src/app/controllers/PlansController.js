import * as Yup from 'yup';

import Plans from '../models/Plans';

class PlansController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.string()
        .required()
        .min(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const plan = await Plans.findOne({ where: { title: req.body.title } });

    if (plan) {
      return res.json({ error: 'There is already a plan!' });
    }

    const { title, duration, price } = await Plans.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plans.findAll();

    if (!plans) {
      return res.json({ error: 'Not found!' });
    }

    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.string()
        .required()
        .min(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    const plan = await Plans.findOne({ where: { id } });

    if (!plan) {
      return res.json({ error: 'Plan not found!' });
    }

    await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.json({ error: 'Plan not found.' });
    }

    await Plans.destroy({ where: { id: plan.id } });

    return res.json().status(200);
  }
}

export default new PlansController();
