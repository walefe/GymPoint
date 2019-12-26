import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinsController from './app/controllers/CheckinsController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import StudentHelpOrdersController from './app/controllers/StudentHelpOrdersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckinsController.index);
routes.post('/students/:id/checkins', CheckinsController.store);

routes.get('/students/:id/help-orders', StudentHelpOrdersController.index);
routes.post('/students/:id/help-orders', StudentHelpOrdersController.store);

routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

routes.get('/help-orders', HelpOrdersController.index);
routes.put('/help-orders/:id/answer', HelpOrdersController.update);

export default routes;
