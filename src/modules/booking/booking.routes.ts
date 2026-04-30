import { Router } from "express";
import { BookingController } from "./booking.controller";
import { USER_ROLES } from "../../constants/userRoles";
import auth from "../../middlewares/auth";


const router: Router = Router();


router.get("/all", auth(USER_ROLES.ADMIN), BookingController.getAllBookings);

router.get("/me", auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR), BookingController.getMyBookings);

router.get("/:bookingId", auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), BookingController.getBookingByBookingId);

router.post("/", auth(USER_ROLES.STUDENT), BookingController.createBooking);

router.patch("/:bookingId/status", auth(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), BookingController.updateBookingStatus);


export const BookingRoutes = router;