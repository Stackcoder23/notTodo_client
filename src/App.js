import logo from './logo.svg';
import './App.css';
import Home from './nottodo/Home';
import Outline from './nottodo/Outline';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from './Login';
import React, { useContext } from 'react';
import User, { UserContext } from './Context';
import Context from './Context';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/home',
    element: <Outline />
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

function App() {
  return (
    <Context>
      <RouterProvider router={router} />
    </Context>
  );
}

export default App;
