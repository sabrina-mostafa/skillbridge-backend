import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";

const router: Router = Router();


router.get("/:tutorId", auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), reviewController.getReviewByTutorId);

router.post("/", auth(USER_ROLES.STUDENT), reviewController.createReview);

router.patch("/:reviewId", auth(USER_ROLES.STUDENT), reviewController.updateReview);

router.delete("/:reviewId", auth(USER_ROLES.STUDENT, USER_ROLES.ADMIN), reviewController.deleteReview);


export const ReviewRoutes = router;