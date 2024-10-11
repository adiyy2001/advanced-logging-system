import createDynamicRouter from '../../../core/dynamicRouter';
import ProfileController from '../controller/profileController';

const profileController = new ProfileController();
const profileRouter = createDynamicRouter(profileController);

export default profileRouter;
