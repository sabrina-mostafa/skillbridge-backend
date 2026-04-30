import { Router } from "express";
import { USER_ROLES } from "../../constants/userRoles";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";


const router: Router = Router();


router.get("/", auth(USER_ROLES.ADMIN), AdminController.getAllUsers);

//  PLATFORM ANALYTICS (ADMIN ONLY)
router.get("/platform", auth(USER_ROLES.ADMIN), AdminController.getPlatformAnalytics);

router.patch("/:userId/status", auth(USER_ROLES.ADMIN), AdminController.updateUserStatus);


export const AdminRoutes = router;