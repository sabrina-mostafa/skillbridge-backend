import { Router } from "express";
import { USER_ROLES } from "../../constants/userRoles";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";


const router: Router = Router();


router.get("/", auth(USER_ROLES.ADMIN), AdminController.getAllUsers);

//  PLATFORM ANALYTICS (ADMIN ONLY)
router.get("/platform", auth(USER_ROLES.ADMIN), AdminController.getPlatformAnalytics);

router.patch("/:userId/status", auth(USER_ROLES.ADMIN), AdminController.updateUserStatus);

router.patch(
    "/tutors/:tutorId/featured",
    auth(USER_ROLES.ADMIN),
    AdminController.updateTutorFeatured
);

// Public route (form)
router.post("/contact", AdminController.createContactMessage);

// Admin route
router.get("/contact", auth(USER_ROLES.ADMIN), AdminController.getAllMessages);

// delete contact message
router.delete("/contact/:messageId", auth(USER_ROLES.ADMIN), AdminController.deleteMessage);

router.get(
    "/reports",
    auth(USER_ROLES.ADMIN),
    AdminController.getReports
);

router.get(
    "/reports/:type",
    auth(USER_ROLES.ADMIN),
    AdminController.generateReport
);


export const AdminRoutes = router;