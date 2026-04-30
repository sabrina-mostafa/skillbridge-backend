import express, { Router } from "express";
import { USER_ROLES } from "../../constants/userRoles";
import auth from "../../middlewares/auth";
import { AvailabilityController } from "./availability.controller";

const router: Router = express.Router();

router.get("/me", auth(USER_ROLES.TUTOR), AvailabilityController.getMyAvailability);

router.get("/all", auth(USER_ROLES.ADMIN), AvailabilityController.getAllAvailabilities);

router.post("/", auth(USER_ROLES.TUTOR), AvailabilityController.createAvailability);

router.patch("/:availabilityId", auth(USER_ROLES.TUTOR, USER_ROLES.ADMIN), AvailabilityController.updateAvailability);

router.delete("/:availabilityId", auth(USER_ROLES.TUTOR, USER_ROLES.ADMIN), AvailabilityController.deleteAvailability);


export const AvailabilityRoutes = router;