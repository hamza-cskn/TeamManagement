import {FooterComponent, NavbarComponent} from "../common/Layout";
import { useLocation } from 'react-router-dom';

export function NotFoundPage() {
    const location = useLocation();

    return (
        <div>
            <NavbarComponent currentPage={"404"}/>
            <div className="bg-red-50 text-title h-screen">
                <h1 className="text-4xl font-bold text-black text-center ">You lost!</h1>
                <p className="text-gray-500 font-medium text-center">The requested page `<span className="font-mono text-gray-600">{location.pathname}</span>`
                    could not found, go to the <a href="/" className="decoration-orange-600 decoration-2 underline">home page</a>.</p>
            </div>
            <FooterComponent/>
        </div>);
}