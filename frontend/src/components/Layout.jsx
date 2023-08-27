import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-orange-400">
            <Header />
            
            <main className="flex-1 flex flex-col justify-center my-2 mb-2">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    )
}

export default Layout;