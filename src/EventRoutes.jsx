import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "./Components/SlideBar/SideBar";
import LoginPage from "./Components/AdminPannelComponents/LoginPage";
import Overview from "./Components/AdminPannelComponents/Overview";
import Participants from "./Components/AdminPannelComponents/Participants";
import FinancialReports from "./Components/AdminPannelComponents/FinancialReports";
import EventDetailsChange from "./Components/AdminPannelComponents/EventDetailsChange";
import MailParticipants from "./Components/AdminPannelComponents/MailParticipants";

const EventRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const eventId = useSelector((state) => state.eventId.value.eventId);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if the current path is the login page
  const isLoginPage = location.pathname.includes("/secure/v3/dasboard/login");

  // If eventId is null, redirect to login
  if (!eventId && !isLoginPage) {
    return <Navigate to={`/secure/v3/dasboard/login/${eventId}`} />;
  }

  return (
    <div className="flex">
      {!isLoginPage && (
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div className={`flex-1 ${!isLoginPage ? "ml-0 sm:ml-64" : ""} p-4`}>
        {!isLoginPage && (
          <button
            className="sm:hidden p-2 bg-gray-800 text-white rounded"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}
        <Routes>
          <Route path="/secure/v3/dasboard/login/:id" element={<LoginPage />} />
          <Route
            path="/secure/v3/dasboard/overview/:id"
            element={<Overview />}
          />
          <Route
            path="/secure/v3/dasboard/participants/:id"
            element={<Participants />}
          />
          <Route
            path="/secure/v3/dasboard/financial-reports/:id"
            element={<FinancialReports />}
          />
          <Route
            path="/secure/v3/dasboard/change-event-details/:id"
            element={<EventDetailsChange />}
          />
          <Route
            path="/secure/v3/dasboard/mail-to-participants/:id"
            element={<MailParticipants />}
          />
          <Route
            path="/"
            element={<Navigate to={`/secure/v3/dasboard/login/${eventId}`} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default EventRoutes;
