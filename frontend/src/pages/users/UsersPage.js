import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";

export function UsersPage() {
    return (
    <section>
        <NavbarComponent/>
        <BreadcrumbComponent items={["users"]}/>
        <div className="min-h-screen">
            <UsersArea/>
        </div>
        <FooterComponent/>
    </section>)
}

function UsersArea() {
    const users = [
        {name: {name: "John", surname: "Doe"}, mail: "johndoe@mail.com"},
        {name: {name: "Micheal", surname: "Doe"}, mail: "janedoe@mail.com"},
        {name: {name: "John", surname: "Smith"}, mail: "johnsmit@mail.com"},
        {name: {name: "John", surname: "Smith"}, mail: "johnsmit@mail.com"},
        {name: {name: "John", surname: "Smith"}, mail: "johnsmit@mail.com"},
        {name: {name: "John", surname: "Smith"}, mail: "johnsmit@mail.com"},
        {name: {name: "John", surname: "Smith"}, mail: "johnsmit@mail.com"},
    ]
    return (
        <div className="mt-16 mb-16">
            <ul className="grid w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-y-8">
                {users.map((user, index) => {
                    return <UserCard user={user}/>
                })}
            </ul>
        </div>
    );
}

function UserCard({user}) {
    return (
        <div className="mx-auto hover:bg-gray-50 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-end px-4 pt-4">
                <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                    <span className="sr-only">Open dropdown</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         viewBox="0 0 16 3">
                        <path
                            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                    </svg>
                </button>
                <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2" aria-labelledby="dropdownButton">
                        <li>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col items-center pb-10">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile.png"
                     alt="Profile"/>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name.name} {user.name.surname}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">Developer</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Department of nowhere</span>
                <hr className="m-1"/>
                <span className="text-sm text-gray-500 dark:text-gray-400">Assigned Issues (2)</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.mail}</span>
                <div className="flex mt-4 md:mt-6">
                    <a href="#"
                       className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Profile</a>

                    <a href="#"
                       className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
                </div>
            </div>
        </div>

    );
}