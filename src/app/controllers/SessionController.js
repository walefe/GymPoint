import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found!' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
      },
      token: jwt.sign({ id }, 'e4fdc02c0cf9bdfe872a43d49502c11b', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();
