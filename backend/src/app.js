import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from "./config/env.js"
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import patientRoutes from "./routes/patient.routes.js";

const app = express();

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/
app.use(helmet());


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
|--------------------------------------------------------------------------
| Cookies
|--------------------------------------------------------------------------
*/

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/
app.use(morgan('dev'));


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

// Doctor routes
app.use("/api/v1/doctor", doctorRoutes);

// Appointment routes
app.use("/api/v1/appointment", appointmentRoutes);

// Patient routes
app.use("/api/v1/patient", patientRoutes);





export default app;