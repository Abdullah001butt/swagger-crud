import React from "react";
import { Routes, Route } from "react-router-dom";
import Country from "./components/Country";
import Sidebar from "./Sidebar/Sidebar";
import City from "./components/City";

const App = () => {
  return (
    <div className="h-screen flex">
      <Sidebar className="w-64 bg-gray-200 p-4" />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Country />} />
          <Route path="/city" element={<City />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
