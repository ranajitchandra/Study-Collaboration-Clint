import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify';
import AuthContextProvider, { AuthContext } from './context/AuthContextProvider'
import { router } from './routes/route';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'aos/dist/aos.css';
import Aos from 'aos';


Aos.init();
const queryClient = new QueryClient();


// Wrapper component to use the context
function AppWithTheme() {
    const { theTheme } = useContext(AuthContext)

    return (
        <div data-theme={theTheme ? "light" : "dark"}>
            <ToastContainer />
            <RouterProvider router={router} />
        </div>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <AppWithTheme />
            </AuthContextProvider>
        </QueryClientProvider>
    </StrictMode>,
)



