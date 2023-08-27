import './App.css';
import Layout from './components/Layout';
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import {Route, Routes} from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" eleemnt={<HomePage />} />
        <Route path="login" eleemnt={<Login />} />
        <Route path="register" eleemnt={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
