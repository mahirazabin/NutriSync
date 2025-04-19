import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ModRecipes from './pages/modPages/ModRecipes';
import ModIngredients from './pages/modPages/ModIngredients';
import ModCategories from './pages/modPages/ModCategories';
import Signup from './pages/Signup';
import Login from './pages/Login';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/Login';
import AdminHome from './pages/Admin/AdminHome';
import ManageMember from './pages/Admin/ManageMember';
import MemberHome from './pages/Member/MemberHome';
import ModeratorHome from './pages/Moderator/ModeratorHome';

import Create from './pages/Member/CreateRecipes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />       
        <Route path="/signup" element={<Signup />} />    
        <Route path="/login" element={<Login />} />      
        <Route path="/member" element={<MemberHome />} />
        <Route path="/member/recipe/create" element={<Create />} />
        <Route path="/moderator" element={<ModeratorHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/moderator/recipes" element={<ModRecipes />} />
        <Route path="/moderator/ingredients" element={<ModIngredients />} />
        <Route path="/moderator/categories" element={<ModCategories />} />
        <Route path="/admin/manage-member" element={<ManageMember />} />
        <Route path="/admin/manage-moderator" element={<ManageMember />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { Create };
export { AdminHome };