import express, { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../constants/userRoles';
import { StudentController } from './student.controller';


const router: Router = express.Router();


router.get('/', auth(USER_ROLES.ADMIN), StudentController.getAllStudentProfiles);

router.get('/me', auth(USER_ROLES.STUDENT), StudentController.getMyStudentProfile);

router.get('/:studentId', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.getStudentProfileById);

router.post("/", auth(USER_ROLES.STUDENT), StudentController.createStudentProfile);

router.patch("/:studentId", auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.updateStudentProfile);

router.delete("/:studentId", auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.deleteStudentProfile);



export const StudentRoutes = router;