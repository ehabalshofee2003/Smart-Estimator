import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div dir="rtl" className="flex h-screen bg-secondary-950 font-cairo overflow-hidden">
      <Sidebar />
      <div className="flex-1 mr-64 h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;