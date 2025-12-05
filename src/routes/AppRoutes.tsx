import { useRoutes } from "react-router-dom";
import Index from "@/pages/Index";
import { LoginPage } from "@/auth/LoginPage";

export function AppRoutes() {
    const routes = useRoutes([

        // NO LOGIN ROUTES HERE
        { path: "/", element: <Index /> },
        { path: "/login", element: <LoginPage /> },



    ]);

    return routes;
}

export default AppRoutes;