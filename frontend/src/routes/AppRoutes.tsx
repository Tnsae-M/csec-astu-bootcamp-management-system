import { Routes, Route } from "react-router-dom";
import Sessions from "../pages/Sessions";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sessions" element={<Sessions />} />
        </Routes>
    );
};

export default AppRoutes;