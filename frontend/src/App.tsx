import React from 'react';
import LoginPage from './pages/Login';
import Create from './pages/Create';

function App() {
  return <LoginPage />;
}

function CreateRecipe() {
  return <Create />;
}

export default App;
export { CreateRecipe };