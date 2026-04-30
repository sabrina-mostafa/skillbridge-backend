import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";

const router: Router = Router();


router.get("/", CategoryController.getAllCategories);

router.post("/", auth(USER_ROLES.ADMIN), CategoryController.createCategory);

router.patch("/:categoryId", auth(USER_ROLES.ADMIN), CategoryController.updateCategory);

router.delete("/:categoryId", auth(USER_ROLES.ADMIN), CategoryController.deleteCategory);


export const CategoryRoutes = router;