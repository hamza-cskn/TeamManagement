import {FooterComponent, NavbarComponent} from "../common/Layout";

export function HomePage() {
    return (
        <div>
            <NavbarComponent currentPage={"Home"}/>
            <div className="bg-white h-lvh text-center pt-5">
                <h1 className="text-3xl font-bold">Welcome to frontend!</h1>
                <p>You can configure this website from <span className="font-mono">config</span>.</p>
            </div>
            <FooterComponent/>
        </div>);
}