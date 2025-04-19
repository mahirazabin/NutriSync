import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from './pages/homePages/AdminHome';
import MemberHome from './pages/homePages/MemberHome';
import ModeratorHome from './pages/homePages/ModeratorHome';
import ModRecipes from './pages/modPages/ModRecipes';
import ModIngredients from './pages/modPages/ModIngredients';
import ModCategories from './pages/modPages/ModCategories';
import Signup from './pages/Signup';
import Login from './pages/Login';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />   {/*Needs to be changed to account for admin and moderator pages*/ }          
        <Route path="/signup" element={<Signup />} />    
        <Route path="/login" element={<Login />} />      
        <Route path="/member" element={<MemberHome />} />
        <Route path="/moderator" element={<ModeratorHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/moderator/recipes" element={<ModRecipes />} />
        <Route path="/moderator/ingredients" element={<ModIngredients />} />
        <Route path="/moderator/categories" element={<ModCategories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
