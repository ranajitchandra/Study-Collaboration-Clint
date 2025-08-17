import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <div className="bg-base-300 min-h-screen flex flex-col">
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-50 shadow-md">
            </header>
                <Navbar />

            {/* Main content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-16 pt-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="mt-auto">
                <Footer />
            </footer>
        </div>
    );
}
