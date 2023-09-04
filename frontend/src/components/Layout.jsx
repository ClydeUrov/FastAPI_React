import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-orange-400">
            <Header />
            
            <div className="flex items-center justify-center h-screen">
            <main className="flex-1 flex flex-col justify-center items-center text-center my-2 mb-2">
                <Outlet />
            </main>
            </div>
            
            <Footer />
        </div>
    )
}

export default Layout;