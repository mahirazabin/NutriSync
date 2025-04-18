import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import AdminHome from './pages/Admin/AdminHome';
import ManageMember from './pages/Admin/ManageMember';
import MemberHome from './pages/Member/MemberHome';
import ModeratorHome from './pages/Moderator/ModeratorHome';

import Create from './pages/Member/CreateRecipes';
import ManageModerator from './pages/Admin/ManageModerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/member/" element={<MemberHome />} />
        <Route path="/member/recipe/create/" element={<Create />} />
        <Route path="/moderator/" element={<ModeratorHome />} />
        <Route path="/admin/:id" element={<AdminHome />} />
        <Route path={`/admin/:id/manage-member/`} element={<ManageMember />} />
        <Route path={`/admin/:id/manage-moderator/`} element={<ManageModerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { Create };
export { AdminHome };