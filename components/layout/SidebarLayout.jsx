"use client"

import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

export default function SidebarLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Changes the content container left margin to move with the side bar
  const contentStyle = {
    marginLeft: sidebarExpanded ? "250px" : "70px",
    transition: "all 0.5s ease-in-out",
    // transition: "margin 0.2s ease"
};

  return (
    <>
      <Navbar sidebarExpanded={sidebarExpanded} />
      <Sidebar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
      <div className='layout-content' style={contentStyle}>
      { children }
      </div>
    </>
  )
}
