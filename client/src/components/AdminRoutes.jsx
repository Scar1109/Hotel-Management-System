import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import ManageEvents from "./admin/ManageEvents";
import ManageFoods from "./admin/ManageFoods";
import ManageOrders from "./admin/ManageOrders";
import ManagePackages from "./admin/ManagePackages";
import ManageParkings from "./admin/ManageParkings";
import ManageRooms from "./admin/ManageRooms";



function AdminRoutes() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="manage-events" element={<ManageEvents />} />
                <Route path="manage-foods" element={<ManageFoods />} />
                <Route path="manage-orders" element={<ManageOrders />} />
                <Route path="manage-packages" element={<ManagePackages />} />
                <Route path="manage-parkings" element={<ManageParkings />} />
                <Route path="manage-rooms" element={<ManageRooms />} />
            </Routes>
        </div>
    );
}

export default AdminRoutes;
