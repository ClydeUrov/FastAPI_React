import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = () => {
    const { user, setUser } = useAuth();
    let navigate = useNavigate();

    const logout = () => {
        setUser({})
        navigate("/login", {replace: true})
    }

    return (
        <div className="navbar bg-primary text-primary-content">
            <div className="header">
                <Link className="btn btn-ghost normal-case text-xl" to="/">FARM Cars</Link>
                <span className="border-2 border-amber-500 p-1">
                    {user?.username ? `Logged in as ${user?.username} - ${user.role}` : "Not logged in"}
                </span>
                <div className="d-flex flex-row">
                    <ul className="complex_list">
                        {!user?.username &&
                        <li className="mx-1"><Link to="/login">Login</Link></li>}   
                        {!user?.username &&        
                        <li className="mx-1"><Link to="/register">Register</Link></li>}
                        <li className="mx-1"><Link to="/admin">Admin</Link></li>
                        <li className="mx-1"><Link to="/protected">Protected</Link></li>
                        <li className="mx-1"><Link to="/new">New Car</Link></li>
                        <li className="mx-1"><Link to="/cars">Cars</Link></li>
                        {user?.username &&
                            <li className="mx-1 d-flex"><button className=" btn-warning" onClick={logout}>
                                Logout <span className="font-semibold">{user?.username}</span></button>
                            </li> 
                        }          
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header;