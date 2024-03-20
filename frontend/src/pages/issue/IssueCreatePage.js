import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";
import {authorizedFetch} from "../../auth/AuthHandler";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const getFormTitle = () => document.getElementById("title")?.value;
const getFormDescription = () => document.getElementById("description")?.value;
const getFormCategory = () => document.getElementById("category")?.value;
const getFormPriority = () => document.getElementById("priority")?.value;

const setFormDraft = () => {
    const data = {title: getFormTitle(), description: getFormDescription()}
    localStorage.setItem("formDraft", JSON.stringify(data));
};

const getFormDraft = () => JSON.parse(localStorage.getItem("formDraft") || "{}");
const deleteFormDraft = () => localStorage.removeItem("formDraft");

const clearForm = () => {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    deleteFormDraft();
}

function postIssue(title, content, category, priority) {
    return authorizedFetch("http://localhost:5229/issue", {
        method: "POST",
        body: JSON.stringify({
            creator: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            title,
            content,
            category,
            priority
        })
    })
}

function handleSubmit(e, navigate) {
    e.preventDefault();
    const title = getFormTitle();
    const description = getFormDescription();
    const priority = getFormPriority();
    const category = getFormCategory();

    // title and description is cannot be empty but validation is cheap fairly
    if (title === "" || description === "" || category === "Select category" || priority === "Select priority")
        return alert("Please fill all fields.");

    postIssue(title, description, category, priority).then(res => {
        if (!res.ok) {
            alert("An error occurred while creating issue.");
            return;
        }
        clearForm();
        /*res.json().then(data => {
            navigate("/issues/" + data.issue.id);
        })*/
    }).catch(ex => alert(ex.toString()));
}

export function IssueCreatePage() {
    return (<div>
        <NavbarComponent currentPage={"Create Issue"}/>
        <BreadcrumbComponent items={["Issues", "Create Issue"]}/>
        <div className="min-h-svh">
            <CreateForm backupData={getFormDraft()}/>
        </div>
        <FooterComponent/>
    </div>);
}

function BackupLoadBanner() {
    return (
        <div id="informational-banner" tabIndex="-1"
             className="fixed top-0 start-0 z-50 flex flex-col justify-between w-full p-4 border-b border-gray-200 md:flex-row bg-green-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="mb-4 md:mb-0 md:me-4">
                <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Draft loaded</h2>
                <p className="flex items-center text-sm font-normal text-gray-600 dark:text-gray-400">We found an issue
                    draft on your local. Title and Description fields loaded. Do you want us to clear the form?</p>
            </div>
            <div className="flex items-center flex-shrink-0">
                <button data-dismiss-target="#informational-banner" type="button"
                        onClick={clearForm}
                        className="inline-flex items-center justify-center px-3 py-2 me-10 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-blue-800">
                    Clear Form
                </button>
                <button data-dismiss-target="#informational-banner" type="button"
                        className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:text-gray-600 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close banner</span>
                </button>
            </div>
        </div>
    );
}


function CreateForm({backupData}) {
    const categories = ["Bug", "Feature", "Technical Support"];
    const priorities = ["Low", "Medium", "High"];

    setInterval(setFormDraft, 5 * 1000);
    const navigate = useNavigate();

    return <section className="bg-white dark:bg-gray-900 h-full">
        {(backupData.title !== "" || backupData.description !== "") &&
            <BackupLoadBanner/>
        }
        <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create an issue</h2>
            <form action="#" onSubmit={e => handleSubmit(e, navigate)}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-2">
                        <label form="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Issue Title
                        </label>
                        <input type="text" name="title" id="title"
                               className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Type title of the issue" required defaultValue={backupData.title}/>
                    </div>
                    <div>
                        <label form="category"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category"
                                className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option>Select category</option>
                            {categories.map((category, index) => {
                                return <option key={index} value={category}>{category}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <label form="priority"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                        <select id="priority"
                                className="focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option>Select priority</option>
                            {priorities.map((priority, index) => {
                                return <option key={index} value={priority}>{priority}</option>
                            })}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label form="description"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea id="description" rows="8"
                                  className="focus:outline-0 min-h-60 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Your description here" required
                                  defaultValue={backupData.description}></textarea>
                    </div>
                </div>
                <button type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700
                        rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Submit
                </button>
            </form>
        </div>
    </section>
}