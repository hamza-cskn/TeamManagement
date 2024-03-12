import { Footer } from 'flowbite-react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

export function NavbarComponent({currentPage, pages}) {
    if (!pages) pages = [
        {name: "Home", href:"/"},
        {name: "Issues", href: "/issues"},
        {name: "Chat", href:"/chat"},
        {name: "Users", href: "/users"},
    ];

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
                    </a>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src="/docs/images/people/linkedinphoto.jpeg" alt="user"/>
                        </button>
                        <ProfileMenu/>
                        <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {pages.map((page, index) => (
                                <li key={index}>
                                    <a
                                        href={page.href}
                                        className={`block py-2 px-3 rounded md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ${
                                            page.name === currentPage ?
                                                'text-white bg-blue-700 md:bg-transparent md:text-blue-700' :
                                                'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                                        }`}
                                        aria-current={page.name === currentPage ? "page" : null} // Add aria-current
                                    >
                                        {page.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export function ProfileMenu({user}) {
    if (!user) user = {
        name: "Hamza COŞKUN",
        email: "hamzacoskun41@gmail.com"
    };
    return (<div
        className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
        id="user-dropdown">
        <div className="px-4 py-3">
            <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
            <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{user.email}</span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
                <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
            </li>
        </ul>
    </div>);
}

export function FooterComponent() {
    return (
        <Footer bgDark>
            <div className="w-full">
                <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
                    <div>
                        <Footer.Title title="Company"/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">About</Footer.Link>
                            <Footer.Link href="#">Careers</Footer.Link>
                            <Footer.Link href="#">Brand Center</Footer.Link>
                            <Footer.Link href="#">Blog</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="help center"/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">Discord Server</Footer.Link>
                            <Footer.Link href="#">Twitter</Footer.Link>
                            <Footer.Link href="#">Facebook</Footer.Link>
                            <Footer.Link href="#">Contact Us</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="legal"/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">Privacy Policy</Footer.Link>
                            <Footer.Link href="#">Licensing</Footer.Link>
                            <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="download"/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">iOS</Footer.Link>
                            <Footer.Link href="#">Android</Footer.Link>
                            <Footer.Link href="#">Windows</Footer.Link>
                            <Footer.Link href="#">MacOS</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
                <div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Flowbite™" year={2022} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export function BreadcrumbComponent({items}) {
    return (
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
            <Breadcrumb.Item href="#" icon={HiHome}>
                Home
            </Breadcrumb.Item>
            {items.map((item, index) => (
                <Breadcrumb.Item key={index}> {/* Use index for a unique key */}
                    {item}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
}

