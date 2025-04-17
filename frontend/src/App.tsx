import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import AdminHome from './pages/homePages/AdminHome';
import MemberHome from './pages/homePages/MemberHome';
import ModeratorHome from './pages/homePages/ModeratorHome';

import Create from './pages/Create';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/member" element={<MemberHome />} />
        <Route path="/moderator" element={<ModeratorHome />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

function CreateRecipe() {
  return <Create />;
}

function AdminHome(){
  return <Admin />;
}

export default App;
export { CreateRecipe };
export { AdminHome };