import {BreadcrumbComponent, FooterComponent, NavbarComponent, Stepper} from "../../common/Layout";
import {useNavigate} from "react-router-dom";
import {authorizedFetch} from "../../auth/AuthHandler";

const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*!~ %';
    let result = '';
    for (let i = 0; i < 13; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
}

export function UserCreatePage()
{
    return <div>
        <NavbarComponent/>
        <BreadcrumbComponent items={["Users", "Create"]}/>
        <div className="min-h-screen">
            <UserCreateArea/>
        </div>
        <FooterComponent/>
    </div>
}

function UserCreateArea()
{
    return <div>
            <div className="mx-auto mt-12 w-full max-w-[640px]">
                <Stepper steps={[{title: "Create User", subtitle: "Admin's Job"}, {title: "Login Account", subtitle: "User"}, {title: "Change Password", subtitle: "User"}]} currentStep={-1}/>
            </div>
            <CreateForm/>
        </div>
}

function handleSubmit(e, navigate) {
    e.preventDefault();
    console.log("submitting...");
    authorizedFetch('http://localhost:5229/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "name": {
                "name": e.target.name.value,
                "surname": e.target.surname.value,
            },
            "mail": e.target.mail.value,
            "department": e.target.department.value,
            "role": e.target.role.value,
            "password": e.target.password.value,
            "permissions": [],
        })
    }).then(response => {
        if (response.ok) {
            //navigate('/users');
        } else {
            throw new Error('Register failed');
        }
    }).catch(ex => {
        console.error('Register error:', ex);
    });
}

function CreateForm({backupData}) {
    const navigate = useNavigate();

    return <section className="bg-white dark:bg-gray-900 h-full">
        <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Register new user</h2>
            <form action="#" onSubmit={e => handleSubmit(e, navigate)}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-1">
                        <label form="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Name <span className="text-red-300">*</span>
                        </label>
                        <input type="text" name="name" id="name"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Hamza" required/>
                    </div>
                    <div className="sm:col-span-1">
                        <label form="surname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Surname <span className="text-red-300">*</span>
                        </label>
                        <input type="text" name="surname" id="surname"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="COŞKUN" required/>
                    </div>
                    <div className="sm:col-span-1">
                        <label form="mail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Mail <span className="text-red-300">*</span>
                        </label>
                        <input type="text" name="mail" id="mail"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="hamzacoskun@mail.com" required/>
                    </div>
                    <div className="sm:col-span-1">
                        <label form="department"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Department
                        </label>
                        <input type="text" name="department" id="department"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="UAB" required/>
                    </div>
                    <div className="sm:col-span-1">
                        <label form="department"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Role
                        </label>
                        <input type="text" name="role" id="role"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                               focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                               dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Developer" required/>
                    </div>
                    <div className="sm:col-span-1">
                        <label form="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password <span className="text-red-300">*</span>
                        </label>
                        <input type="text" name="password" id="password"
                               className="focus:outline-none bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                               focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                               dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="••••••••" required defaultValue={generatePassword()}/>
                    </div>
                </div>
                <button type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white
                        bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800">
                    Create
                </button>
            </form>
        </div>
    </section>
}