import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { AdminDashboard } from "../pages/AdminDashboard";
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/*Public layout*/}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                </Route>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
