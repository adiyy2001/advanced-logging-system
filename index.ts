import 'reflect-metadata';
import express from 'express';
import logger from './core/logger';
import * as permissionsRoutes from './api/routes/permissionRouter';
import * as moduleRoutes from './api/routes/moduleRouter';
import * as profileModule from './modules/profile';
import globalAccessLogger from './api/middlewares/globalAccessLogger';

const app = express();
const PORT = 3000;

app.use(globalAccessLogger);

app.use(express.json());
app.use(permissionsRoutes.default);
app.use(moduleRoutes.default);
app.use(profileModule.default);

// app._router.stack.forEach((middleware: any) => {
//   if (middleware.route) {
//     const route = middleware.route;
//     const methods = Object.keys(route.methods).join(', ').toUpperCase();
//     console.log(`Path: ${route.path}, Methods: ${methods}`);
//   } else if (middleware.name === 'router') {
//     middleware.handle.stack.forEach((handler: any) => {
//       const route = handler.route;
//       if (route) {
//         const methods = Object.keys(route.methods).join(', ').toUpperCase();
//         console.log(`Nested Path: ${route.path}, Methods: ${methods}`);
//       }
//     });
//   }
// });

app.listen(PORT, () => {
  logger.roleLogger.Admin(`Server is running at http://localhost:${PORT}`, 'Info');
});

export default app;
