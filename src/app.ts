import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { TutorRoutes } from "./modules/tutors/tutor.routes";
import { CategoryRoutes } from "./modules/category/category.routes";
import { ReviewRoutes } from "./modules/review/review.routes";
import { StudentRoutes } from "./modules/students/student.routes";
import { AvailabilityRoutes } from "./modules/availability/availability.routes";
import { BookingRoutes } from "./modules/booking/booking.routes";
import { AdminRoutes } from "./modules/admin/admin.routes";
import { globalErrorHandler } from "./errors/globalErrorHandler";
import { env } from "./config/env";

const app: Application = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors({
  origin: env.APP_URL || 'http://localhost:3000',
  credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());


// better auth
app.all('/api/auth/{*any}', toNodeHandler(auth));


// Admin
app.use("/users", AdminRoutes);

// Tutor Profiles
app.use("/tutors", TutorRoutes);

// Student Profiles
app.use("/students", StudentRoutes);

// Categories
app.use("/category", CategoryRoutes);

// Availability
app.use("/availability", AvailabilityRoutes);

// Bookings
app.use("/booking", BookingRoutes);

// Reviews
app.use("/review", ReviewRoutes);

// test
app.get('/', (req, res) => {
  res.send('Hello from Sabrina ^.^')
});


// Error handler
app.use(globalErrorHandler);



export default app;