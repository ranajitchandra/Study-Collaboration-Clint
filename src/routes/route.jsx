
import { createBrowserRouter, Navigate } from "react-router";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashBoardLayout";
import DashBoardHome from "../pages/dashboard/DashBoardHome";
import CreateStudySession from "../pages/dashboard/tutor/CreateStudySession";
import MyStudySessions from "../pages/dashboard/tutor/MyStudySession";
import UploadMaterials from "../pages/dashboard/tutor/UploadMaterials";
import ViewMaterialsBySession from "../pages/dashboard/tutor/ViewMaterialsBySession";
import ViewAllUsers from "../pages/dashboard/admin/ViewAllUsers";
import PendingAllStudySessions from "../pages/dashboard/admin/AllStudySession";
import UpdateStudySession from "../pages/dashboard/admin/UpdateStudySession";
import AdminMaterialsList from "../pages/dashboard/admin/ViewAllMaterials";
export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout></MainLayout>,
            children: [
                {
                    path: "/",
                    element: <h1>dd</h1>
                },
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
            element: <DashboardLayout></DashboardLayout> ,
            children: [
                {
                    index: true,
                    element: <DashBoardHome></DashBoardHome>
                },
                // Tutor
                {
                    path: "create-study-session",
                    element: <CreateStudySession></CreateStudySession>
                },
                {
                    path: "my-study-sessions",
                    element: <MyStudySessions></MyStudySessions>
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
                    element: <ViewAllUsers></ViewAllUsers>
                },
                {
                    path: "admin-view-all-study-sessions",
                    element: <PendingAllStudySessions></PendingAllStudySessions>
                },
                {
                    path: "update-session/:id",
                    element: <UpdateStudySession></UpdateStudySession>
                },
                {
                    path: "materials-list",
                    element: <AdminMaterialsList></AdminMaterialsList>
                },
            ]
        },
    ]
)


