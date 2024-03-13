import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";
import {IssuePriority, IssueStatus} from "./IssuesPage";
import {useState} from "react";
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

function fetchIssue(id, setIssue, setError) {
    return authorizedFetch(`http://localhost:5229/issue/${id}`)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "We are not able to information for this issue.");
                return;
            }

            if (!data.issue) {
                setError("Response does not include issue information.");
                return;
            }

            setIssue(data.issue);
        })
        .catch(ex => setError(ex.toString()));
}

export function IssuePage({id}) {
    const location = useLocation();
    const path = location.pathname.endsWith('/') ? location.pathname.substring(0, location.pathname.length - 1) : location.pathname;
    id = path.substring(path.lastIndexOf('/') + 1, path.length);
    const [issue, setIssue] = useState(undefined);
    const [error, setError] = useState(undefined);

    fetchIssue(id, setIssue, setError); //do it background

    return <div>
        <NavbarComponent currentPage={"Issues"}/>
        <BreadcrumbComponent items={["Issues", shortString(issue ? issue.title : "...", 100)]}/>
        <Area issue={issue} error={error}/>
        <FooterComponent/>
    </div>;
}

function Area({issue, error}) {
    if (error)
        return <ErrorComponent error={error} message={"An error occurred while getting issue information."}/>

    if (!issue)
        return <div className="bg-gray-50 min-h-screen text-title text-center">Loading...</div>

    return <div className="bg-white min-h-screen pt-6">
        <h1 className="text-3xl font-bold pl-8">
            <div className="inline-flex mr-4">
                <IssueStatus status={issue.status} width={24} height={24}/>
            </div>
            {issue.title}
        </h1>
        <div className="pt-12 pb-12">
            <IssueArea issue={issue}/>
        </div>
        <Comments comments={issue.comments}/>
    </div>
}

/*function IssueDetails({issue}) {
    return (
        <div className="w-2/3 m-auto">
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
                                Creation Date
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
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Author
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
                                <span>05 July 2004 06:34</span>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span>Hamza COŞKUN</span>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}*/

function IssueArea({issue}) {
    const content = <div>
        <p className="text-gray-700 font-medium">
            {issue.content.content}
        </p>
    </div>
    return <MessageBubble content={content} writer={{name: "Hamza COŞKUN"}} date={"5 July 2004 06:35"} self={true}/>;
}

function MessageBubble({content, writer, date, self= false}) {
    let borderColor, bgColor;
    if (self) {
        borderColor = "border-blue-300";
        bgColor = "bg-blue-100";
    } else {
        borderColor = "border-gray-300";
        bgColor = "bg-[#f6f8fa]";
    }
    return (
    <div className="flex items-start gap-2.5 pl-5">
        <img className="w-8 h-8 rounded-full" src="/docs/images/people/linkedinphoto.jpeg" alt="Jese image"/>
        <div className={`flex flex-col w-full max-w-[640px] leading-1.5 border ${borderColor} bg-white rounded-e-md rounded-es-md dark:bg-gray-700`}>
            <div className={`flex items-center space-x-2 pl-4 p-2 rounded-tr-md border-b ${bgColor} ${borderColor}`}>
                <a href="#" className="text-sm font-semibold text-gray-600 dark:text-white hover:text-blue-600 hover:underline">{writer.name}</a>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{date}</span>
            </div>
            <p className="text-sm font-normal py-2.5 pl-4 text-gray-900 dark:text-white">{content}</p>
        </div>
        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start"
                className="inline-flex items-center p-2 text-sm font-medium text-center
                        text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white
                        focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                type="button">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                <path
                    d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
            </svg>
        </button>
        <div id="dropdownDots"
             className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                <li>
                    <a href="#"
                       className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                </li>
                <li>
                    <a href="#"
                       className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red">Delete</a>
                </li>
            </ul>
        </div>
    </div>);
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
        <div className="max-w-2xl px-4">
            {comments.map((comment, index) => <MessageBubble content={comment} date={"9 April 2009 19:23"} writer={"Steve Jobs"}/>)}
            <div className="ml-10">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
                </div>
                <form>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
            </div>
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

function UserPopup() {
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