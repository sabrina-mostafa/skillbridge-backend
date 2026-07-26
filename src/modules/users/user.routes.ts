import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";


const router: Router = Router();


router.patch("/select-role", auth(), UserController.updateUserRole);

router.patch("/profile-image", auth(USER_ROLES.TUTOR, USER_ROLES.STUDENT), UserController.updateProfileImage);

router.post("/resend-verification", UserController.resendVerificationEmail);


export const UserRoutes = router;