import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";
import {IssuePriority} from "./IssuesPage";
import {useEffect, useState} from "react";
import {authorizedFetch} from "../../auth/AuthHandler";
import {useLocation} from "react-router-dom";
import {ErrorComponent} from "../../auth/Error";

/**
 * returns the first n characters of the string
 * if the string is longer than n, it adds "..."
 * to the end of the string.
 *
 * @param str
 * @param n
 * @returns {string|*}
 */
export function shortString(str, n) {
    if (!str || n < 0)
        return undefined;
    return str.length > n ? str.substring(0, n) + "..." : str;
}

export function IssuePage({id}) {
    const location = useLocation();
    const path = location.pathname.endsWith('/') ? location.pathname.substring(0, location.pathname.length - 1) : location.pathname;
    id = path.substring(path.lastIndexOf('/') + 1, path.length);
    /*const exIssue = {
        id: id,
        title: "PRODUCTION SERVERS DONT RESPOND!!! MONGOBD CACHE PRESSURE EXTREMELY HIGH!!",
        content: "WE DONT HAVE ANY IDEA ABOUT THE PROBLEM. WE NEED TO SOLVE IT IMMEDIATELY.",
        priority: "High",
        category: "Feature Request",
        status: "Close",
        created_at: "2021-10-10"
    };*/
    const [issue, setIssue] = useState(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetchIssue() {
            await authorizedFetch(`http://localhost:5229/issue/${id}`)
                .then(async response => {
                    const data = await response.json();
                    console.log(data);
                    if (!response.ok) {
                        setError(data.message || "We are not able to information for this issue.");
                        return;
                    }
                    if (!data.issue) {
                        setError("Response does not include issue information.");
                        return;
                    }
                    console.log(data.issue);
                    setIssue(data.issue);
                })
                .catch(ex => setError(ex.toString()));
        }

        fetchIssue();
    }, [id]);

    let page;
    if (error)
        page = <ErrorComponent error={error} message={"An error occurred while getting issue information."}/>
    else if (issue)
        page = <div className="bg-gray-50 min-h-screen">
            <BreadcrumbComponent items={["Issues", shortString(issue.title, 30)]}/>
            <IssueDetails issue={issue}/>
            <IssueArea issue={issue}/>
            <Comments comments={issue.comments}/>
        </div>
    else
        page = <div className="bg-gray-50 min-h-screen text-title text-center">Loading...</div>
    return <div>
        <NavbarComponent currentPage={"Issues"}/>
        {page}
        <FooterComponent/>
    </div>;
}

function IssueDetails({issue}) {
    const shortTitle = shortString(issue.title, 30);
    return (
        <div className="w-1/2 m-auto">
            <div className="relative overflow-x-auto sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Priority
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Title
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Category
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Status
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span><IssuePriority priority={issue.priority}/></span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span>{shortTitle}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span>{issue.category}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span>{issue.status}</span>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function IssueArea({issue}) {
    return (
        <div className="w-1/2 m-auto pt-16">
            <h1 className="text-3xl font-bold pb-8 text-center">{issue.title}</h1>
            <p className="text-gray-700 font-medium pb-32">{issue.content.content}</p>
        </div>
    );
}

function Comments({comments}) {
    /*comments += [
        {writer: "Çağatay EREM", content: "our interns broke the entire system. i think we should cancel their vpn access."},
        {writer: "Aziz AYDIN", content: "i need my tea. i will not work until we have tea in the office."},
        {writer: "Enes YAPMAZ", content: "i checked fast api. it is not related with it."},
        {writer: "Ahmet KESKIN", content: "❤️"},
        {writer: "Sefa AKDAŞ", content: "we have to fix the issue immediately. but let me finish my tea first."}
    ]*/
    return (<section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
            </div>
            <form className="mb-6">
                <div
                    className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label form="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows="6"
                              className="px-0 min-h-16 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                              placeholder="Write a comment..." required></textarea>
                </div>
                <button type="submit"
                        className="inline-flex items-start py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Post comment
                </button>
            </form>
            {comments.map((comment, index) => <CommentComponent comment={comment} />)}
        </div>
    </section>)
}

function CommentComponent({comment}) {
    return (
        <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        {comment.writer}
                    </p>
                    <UserPopup/>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate dateTime="2022-02-08"
                              title="February 8th, 2022">Feb. 8, 2022
                        </time>
                    </p>
                </div>
                <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        type="button">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 16 3">
                        <path
                            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                    </svg>
                    <span className="sr-only">Comment settings</span>
                </button>
                <div id="dropdownComment1"
                     className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton">
                        <li>
                            <a href="#"
                               className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        </li>
                    </ul>
                </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400 text-left">{comment.content.content}</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                    </svg>
                    Reply
                </button>
            </div>
        </article>
    );
}

function UserPopup()
{
    return (<div data-popover id="popover-user-profile" role="tooltip"
                 className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600">
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <a href="#">
                    <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg"
                         alt="Jese Leos"/>
                </a>
                <div>
                    <button type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Follow
                    </button>
                </div>
            </div>
            <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
                <a href="#">Jese Leos</a>
            </p>
            <p className="mb-3 text-sm font-normal">
                <a href="#" className="hover:underline">@jeseleos</a>
            </p>
            <p className="mb-4 text-sm">Open-source contributor. Building <a href="#"
                                                                             className="text-blue-600 dark:text-blue-500 hover:underline">flowbite.com</a>.
            </p>
            <ul className="flex text-sm">
                <li className="me-2">
                    <a href="#" className="hover:underline">
                        <span className="font-semibold text-gray-900 dark:text-white">799</span>
                        <span>Following</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:underline">
                        <span className="font-semibold text-gray-900 dark:text-white">3,758</span>
                        <span>Followers</span>
                    </a>
                </li>
            </ul>
        </div>
        <div data-popper-arrow></div>
    </div>);
}