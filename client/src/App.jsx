// Desc: Main App component
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import EventListPage from "./pages/EventListPage";
import EventViewPage from "./pages/EventViewPage";
import FeedbackPage from "./pages/FeedbackPage";
import LoginPage from "./pages/LoginPage";
import OrderFoodPage from "./pages/OrderFoodPage";
import RoomListPage from "./pages/RoomListPage";
import RoomViewPage from "./pages/RoomViewPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import TakeAwayPage from "./pages/TakeAwayPage";



function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomeScreen />} exact />
                    <Route path="/admin" element={<AdminPage />} exact />
                    <Route path="/events" element={<EventListPage />} exact />
                    <Route path="/events/:id" element={<EventViewPage />} exact />
                    <Route path="/feedback" element={<FeedbackPage />} exact />
                    <Route path="/login" element={<LoginPage />} exact />
                    <Route path="/order" element={<OrderFoodPage />} exact />
                    <Route path="/rooms" element={<RoomListPage />} exact />
                    <Route path="/rooms/:id" element={<RoomViewPage />} exact />
                    <Route path="/signup" element={<SignupPage />} exact />
                    <Route path="/profile" element={<UserProfilePage />} exact />
                    <Route path="/takeaway" element={<TakeAwayPage />} exact />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
