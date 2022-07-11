import React from "react";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

export const Dasboard = () => {
  return (
    <div>
      <Navbar />
      <div class="content">
        <Sidebar active="dashboard" />
        <h1>Dasboard</h1>
      </div>
    </div>
  );
};
