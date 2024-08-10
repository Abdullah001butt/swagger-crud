import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-bold">Country CRUD App</h1>
      </div>
      <ul className="list-none mb-0">
        <li className="py-2 px-4 hover:bg-gray-700">
          <Link to="/" className="text-white hover:text-white">
            Countries
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-700">
          <Link to="/city" className="text-white hover:text-white">
            City
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
