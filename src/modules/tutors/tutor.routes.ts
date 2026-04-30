import express, { Router } from 'express';
import { TutorController } from './tutor.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../constants/userRoles';


const router: Router = express.Router();


router.get('/', TutorController.getAllTutorProfiles);

router.get('/me', auth(USER_ROLES.TUTOR), TutorController.getMyTutorProfile);

router.get('/:tutorId', TutorController.getTutorProfileById);

router.get('/:tutorId/available-dates', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.TUTOR), TutorController.getAvailableDates);

router.get('/:tutorId/available-dates/slots', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.TUTOR), TutorController.getAvailableSlotsForDate);

router.post("/", auth(USER_ROLES.TUTOR), TutorController.createTutorProfile);

router.patch("/:tutorId", auth(USER_ROLES.ADMIN, USER_ROLES.TUTOR), TutorController.updateTutorProfile);

router.delete("/:tutorId", auth(USER_ROLES.ADMIN, USER_ROLES.TUTOR), TutorController.deleteTutorProfile);



export const TutorRoutes = router;