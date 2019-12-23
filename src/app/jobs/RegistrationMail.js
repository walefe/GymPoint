import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { name, email, plan, dateStart, endDate } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Matrícula',
      template: 'confirmedRegistration',
      context: {
        student: name,
        plan,
        start_date: format(
          parseISO(dateStart),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        endDate,
      },
    });
  }
}

export default new RegistrationMail();
