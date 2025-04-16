import React from 'react';
import LoginPage from './pages/Login';
import Create from './pages/Create';
import Admin from './pages/Admin';

function App() {
  return <LoginPage />;
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