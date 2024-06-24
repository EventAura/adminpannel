import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { navigation, navsFooter } from "../../constants";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const eventSelector = useSelector((state) => state.eventId.value);

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-950 bg-opacity-50 z-40 transition-opacity duration-300 sm:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <nav
        className={`fixed top-0 left-0 h-full bg-gray-950 space-y-8 w-64 sm:w-64 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-8">
            <button className="sm:hidden text-gray-300" onClick={toggleSidebar}>
              ✕
            </button>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-auto">
            <ul className="px-4 text-sm font-medium flex-1">
              {navigation.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`${item.href}/${eventSelector.eventId}`}
                    className="flex items-center gap-x-2 text-gray-300 p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 duration-150"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <ul className="px-4 pb-4 text-sm font-medium">
                {navsFooter.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`${item.href}/${eventSelector.eventId}`}
                      className="flex items-center gap-x-2 text-gray-300 p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 duration-150"
                    >
                      <div className="text-gray-500">{item.icon}</div>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
