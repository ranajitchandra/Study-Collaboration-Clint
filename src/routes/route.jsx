
import { createBrowserRouter, Navigate } from "react-router";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashBoardLayout";
import DashBoardHome from "../pages/dashboard/dashBoardHome/DashBoardHome";
import CreateStudySession from "../pages/dashboard/tutor/CreateStudySession";
import MyStudySessions from "../pages/dashboard/tutor/MyStudySession";
import UploadMaterials from "../pages/dashboard/tutor/UploadMaterials";
import ViewMaterialsBySession from "../pages/dashboard/tutor/ViewMaterialsBySession";
import ViewAllUsers from "../pages/dashboard/admin/ViewAllUsers";
import PendingAllStudySessions from "../pages/dashboard/admin/AllStudySession";
import UpdateStudySession from "../pages/dashboard/admin/UpdateStudySession";
import AdminMaterialsList from "../pages/dashboard/admin/ViewAllMaterials";
import AvailableStudySessions from "../pages/sessions/AvailableStudySessions";
import StudySessionDetails from "../pages/sessions/StudySessionDetails";
import Payment from "../pages/Payment/Payment";
import TutorsList from "../tutor/TutorList";
import MyBookedSessions from "../pages/dashboard/student/BookedSession";
import BookedSessionDetails from "../pages/dashboard/student/BookSessionDetails";
import CreateNote from "../pages/dashboard/student/CreateNote";
import MyNotes from "../pages/dashboard/student/Mynotes";
import StudyMaterials from "../pages/dashboard/student/StudyMaterials";
import ErrorPage from "../components/ErrorPage";
import Forbidden from "../components/Forbidden";
import AdminRoute from "../pages/roleAccess/AdminRoute";
import TutorRoute from "../pages/roleAccess/TutorRoute";
import PrivateRoute from "./PrivateRoute";
import HomeLayout from "../layouts/HomeLayout";








export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout></MainLayout>,
            children: [
                {
                    path: "/",
                    element: <HomeLayout></HomeLayout>
                },
                // student and all
                {
                    path: "/study-sessions",
                    element: <AvailableStudySessions></AvailableStudySessions>
                },
                {
                    path: "/sessions-details/:id",
                    element: <StudySessionDetails></StudySessionDetails>
                },
                {
                    path: "/payment/:sessionId",
                    element: <Payment></Payment>
                },
                {
                    path: "/tutors",
                    element: <TutorsList></TutorsList>
                }
            ]
        },
        {
            path: "/",
            element: <AuthLayout></AuthLayout> ,
            children: [
                {
                    path: "login",
                    element: <Login></Login>
                },
                {
                    path: "register",
                    element: <Register></Register>
                },
            ]
        },
        {
            path: "/dashboard",
            element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute> ,
            children: [
                {
                    index: true,
                    element: <DashBoardHome></DashBoardHome>
                },
                // Tutor
                {
                    path: "create-study-session",
                    element: <TutorRoute> <CreateStudySession></CreateStudySession> </TutorRoute>
                },
                {
                    path: "my-study-sessions",
                    element: <TutorRoute> <MyStudySessions></MyStudySessions></TutorRoute>
                },
                {
                    path: "upload-materials/:id",
                    element: <UploadMaterials></UploadMaterials>
                },
                {
                    path: "view-materials-by-session/:id",
                    element: <ViewMaterialsBySession></ViewMaterialsBySession>
                },
                // Admin
                {
                    path: "view-all-users",
                    element:  <AdminRoute> <ViewAllUsers></ViewAllUsers> </AdminRoute>
                },
                {
                    path: "admin-view-all-study-sessions",
                    element: <AdminRoute> <PendingAllStudySessions></PendingAllStudySessions> </AdminRoute>
                },
                {
                    path: "update-session/:id",
                    element: <UpdateStudySession></UpdateStudySession> 
                },
                {
                    path: "materials-list",
                    element: <AdminRoute><AdminMaterialsList></AdminMaterialsList> </AdminRoute>
                },
                // student
                {
                    path: "booked-sessions",
                    element: <MyBookedSessions></MyBookedSessions>
                },
                {
                    path: "booked-session-details/:bookedSessionId",
                    element: <BookedSessionDetails></BookedSessionDetails>
                },
                {
                    path: "create-note",
                    element: <CreateNote></CreateNote>
                },
                {
                    path: "notes",
                    element: <MyNotes></MyNotes>
                },
                {
                    path: "study-materials",
                    element: <StudyMaterials></StudyMaterials>
                }
            ]
        },
        {
            path: "forbidden",
            element: <Forbidden></Forbidden>
        },
        {
            path: "*",
            element: <ErrorPage></ErrorPage>
        }
    ]
)


