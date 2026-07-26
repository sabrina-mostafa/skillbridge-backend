import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";
import { ConversationController } from "./conversation.controller";



const router: Router = Router();

router.get(
    "/",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    ConversationController.getMyConversations
);

router.get(
    "/contacts",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    ConversationController.getContacts
);

router.get(
    "/:conversationId",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    ConversationController.getConversationById
);

router.post(
    "/",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    ConversationController.createConversation
);

router.patch(
    "/:conversationId/read",
    auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
    ConversationController.markConversationRead
);

export const ConversationRoutes = router;