import './App.css';
import Layout from './components/Layout';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./pages/HomePage";
import {Route, Routes} from "react-router-dom"
import CarList from './components/CarList';
import Cars from './pages/Cars';
import RequireAuthevtication from './components/auth/RequireAuthevtication';
import Admin from './components/Admin';
import NewCar from './pages/NewCar';
import NotFound from './pages/NotFound';
import Car from './pages/Car';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuthevtication />}>
          <Route path=":id" element={<Car />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="admin" element={<Admin/>} />
          <Route path="/new" element={<NewCar/>} />
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
