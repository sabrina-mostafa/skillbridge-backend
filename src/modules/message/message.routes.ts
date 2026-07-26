import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";
import { MessageController } from "./message.controller";


const router: Router = Router();

router.get(
    "/:conversationId",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    MessageController.getMessages
);

router.post(
    "/:conversationId",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    MessageController.sendMessage
);

router.patch(
    "/:messageId/read",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    MessageController.markMessageRead
);


export const MessageRoutes = router;