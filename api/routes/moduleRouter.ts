import { Router } from 'express';
import PermissionsController from '../controllers/permissionsController';

const router = Router();

router.post('/assign-role', PermissionsController.assignRole);
router.get('/check-permissions', PermissionsController.checkPermissions);

export default router;
