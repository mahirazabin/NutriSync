import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ModRecipes from './pages/Moderator/ModRecipes';
import ModIngredients from './pages/Moderator/ModIngredients';
import ModCategories from './pages/Moderator/ModCategories';
import Signup from './pages/Signup';
import Login from './pages/Login';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/Login';
import AdminHome from './pages/Admin/AdminHome';
import ManageMember from './pages/Admin/ManageMember';
import MemberHome from './pages/Member/MemberHome';
import ModeratorHome from './pages/Moderator/ModeratorHome';

import Create from './pages/Member/CreateRecipes';
import ManageModerator from './pages/Admin/ManageModerator';
import MemberTracker from './pages/Member/MemberTracker';
import MemberProfile from './pages/Member/MemberProfile';
import SearchRecipes from './pages/Member/SearchRecipes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />       
        <Route path="/signup/" element={<Signup />} />    
        <Route path="/login/" element={<Login />} />      
        <Route path="/member/:id/" element={<MemberHome />} />
        <Route path={`/member/:id/profile/`} element={<MemberProfile />} />
        <Route path={`/member/:id/create/`} element={<Create />} />
        <Route path={`/member/:id/tracker/`} element={<MemberTracker />} />
        <Route path="/member/:id/search" element={<SearchRecipes />} />
        <Route path="/moderator/:id" element={<ModeratorHome />} />
        <Route path="/admin/:id" element={<AdminHome />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/moderator/:id/recipes/" element={<ModRecipes />} />
        <Route path="/moderator/:id/ingredients/" element={<ModIngredients />} />
        <Route path="/moderator/:id/categories/" element={<ModCategories />} />
        <Route path={`/admin/:id/manage-member/`} element={<ManageMember />} />
        <Route path={`/admin/:id/manage-moderator/`} element={<ManageModerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { Create };
export { AdminHome };