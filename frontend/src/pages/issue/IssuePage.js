import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";
import {IssueStatus} from "./IssuesPage";
import {useEffect, useState} from "react";
import {authorizedFetch} from "../../auth/AuthHandler";
import {useLocation} from "react-router-dom";
import {ErrorComponent, LoadingComponent} from "../../auth/FetchStates";
import {IssueBubble} from "./IssueBubble";
import EditorJS from "@editorjs/editorjs";
import Editor from "../../editor/Editor";

// Initial Data
const INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [
        {
            type: "header",
            data: {
                text: "This is my awesome editor!",
                level: 1,
            },
        },
    ],
};

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

export function IssuePage() {
    const location = useLocation();
    const path = location.pathname.endsWith('/') ? location.pathname.substring(0, location.pathname.length - 1) : location.pathname;
    const issueId = path.substring(path.lastIndexOf('/') + 1, path.length);
    const [issue, setIssue] = useState(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        fetchIssue(issueId, setIssue, setError); //do it background
    }, [issueId, setIssue, setError]);
    return <div>
        <NavbarComponent currentPage={"Issues"}/>
        <BreadcrumbComponent items={["Issues", shortString(issue ? issue.title : "...", 100)]}/>
        <IssueArea issue={issue} error={error}/>
        <FooterComponent/>
    </div>;
}

function IssueArea({issue, error, comments}) {
    const [data, setData] = useState(INITIAL_DATA);

    if (error)
        return <ErrorComponent error={error} message={"An error occurred while getting issue information."}/>
    if (!issue)
        return <LoadingComponent message={"Loading..."}/>
    return <div className="bg-white min-h-screen pt-6">
        <h1 className="text-3xl font-bold pl-8">
            <div className="inline-flex mr-4">
                <IssueStatus status={issue.status} width={24} height={24}/>
            </div>
            {issue.title}
        </h1>
        <div className="pt-12 pb-12">
            <IssueBubble content={issue.content.content} writer={{name: "Hamza COŞKUN"}} date={Date.now()} self={true}/>
        </div>
        <div>
            <div className="editor">
                <Editor data={data} onChange={setData} editorblock="editorjs-container"/>
                <button
                    className="savebtn"
                    onClick={() => {
                        alert(JSON.stringify(data));
                    }}
                >
                    Save
                </button>
            </div>
        </div>
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
