import {BreadcrumbComponent, FooterComponent, NavbarComponent} from "../../common/Layout";
import {useEffect, useState} from "react";
import {shortString} from "./IssuePage";
import {authorizedFetch} from "../../auth/AuthHandler";
import {ErrorComponent} from "../../auth/Error";
import {useNavigate} from "react-router-dom";

const ROWS_PER_PAGE = 5;

export function IssuesPage() {
    return (<div>
        <NavbarComponent currentPage={"Issues"}/>
        <BreadcrumbComponent items={["Issues"]}/>
        <IssuesArea/>
        <FooterComponent/>
    </div>)
}

function IssuesArea() {
    const [fetchedIssues, setFetchedIssues] = useState([]);
    const [error, setError] = useState(null);
    const [issues, setIssues] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        authorizedFetch('http://localhost:5229/issue/').then(response => response.json()).then(data => {
            setFetchedIssues(data.issues);
            setIssues(data.issues);
        }).catch(err => setError(err));
    }, []);

    if (error) {
        return (<ErrorComponent error={error.message} message={"An error occurred while getting issues information"}/>);
    }

    if (!issues) {
        return (<div className="bg-gray-50 min-h-screen text-title text-center">Loading...</div>);
    }

    return (
        <div className="bg-white text-center pt-5">
            <h1 className="text-3xl font-bold">Issues</h1>
            <p className="text-center text-gray-700 w-96 ml-auto mr-auto">
                Here you can see all issues. You can filter and search issues. You can also create new issue. You
                can see the details of an issue by clicking on it.
            </p>
            <div className="m-8 mr-auto ml-auto w-full ">
                <SearchBar fetchedIssues={fetchedIssues} setIssues={setIssues} setPage={setPage}/>
                <CreateButton/>
            </div>
            <IssuesTable issues={issues} page={page}/>
            <div className="lg:pl-16 lg:pr-16 sm:pl-4 sm:pr-4 pb-8">
                <IssueTablePaginationBar issues={issues} setIssues={setIssues} page={page} setPage={setPage}/>
            </div>
        </div>);
}

function CreateButton() {
    const navigate = useNavigate();
    return (<button onClick={() => {
        navigate('/issues/create');
    }} type="button"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-blue-900 m-0">
        <svg height="20" width="20" fill="#ffffff" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <title/>
            <path
                d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z"/>
            <path
                d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z"/>
            <path
                d="M386.34,193.66,264.45,315.79A41.08,41.08,0,0,1,247.58,326l-25.9,8.67a35.92,35.92,0,0,1-44.33-44.33l8.67-25.9a41.08,41.08,0,0,1,10.19-16.87L318.34,125.66A8,8,0,0,0,312.69,112H104a56,56,0,0,0-56,56V408a56,56,0,0,0,56,56H344a56,56,0,0,0,56-56V199.31A8,8,0,0,0,386.34,193.66Z"/>
        </svg>
        &nbsp;New
    </button>)
}

function filterIssues(issues, search) {
    return issues.filter(issue => {
        const searchWords = search.split(" ");
        for (let searchWord of searchWords) {
            const titleWords = issue.title.split(" ");
            for (let titleWord of titleWords) {
                if (titleWord.toLowerCase().includes(searchWord.toLowerCase()))
                    return true;
            }
        }
        return false;
    });
}

export function SearchBar({fetchedIssues, setIssues, setPage}) {
    const handleSubmit = (event) => {
        event.preventDefault();
    }
    const handleSearch = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value == null) {
            setIssues(fetchedIssues);
            return;
        }
        const filteredIssues = filterIssues(fetchedIssues, value);
        setIssues(filteredIssues);
        setPage(1);
    }
    return (<form className="max-w-[640px] lg:w-[640px] inline-flex p-4" onSubmit={handleSubmit}>
        <label form="default-search"
               className="mb-2 text-xs font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input onChange={handleSearch} type="search" id="search" className="block w-full p-3 pl-10 text-xs
                                    text-gray-900 border border-gray-300 lg:rounded-lg sm:rounded-none bg-gray-50 focus:ring-blue-500
                                    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                    dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                   placeholder="Search an issue"/>
        </div>
    </form>);
}

function calculatePageNumbers(page, slotCount, maxPage) {
    if (slotCount > maxPage)
        slotCount = maxPage;
    //throw new Error("slot count(" + slotCount + ") cannot be bigger than max page(" + maxPage + ")!");
    const smallest = Math.min(Math.max(page + Math.ceil(-slotCount / 2), 1), maxPage + 1 - slotCount);
    return Array.from({length: slotCount}, (_, i) => smallest + i);
}

export function IssueTablePaginationBar({page, setPage, issues, setIssues}) {
    const totalPage = Math.ceil(issues.length / ROWS_PER_PAGE);
    const pages = calculatePageNumbers(page, 5, totalPage);
    return (<nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                 aria-label="Table navigation">
        {issues.length === 0 ?
            (<div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing nothing</span>
            </div>
            ) : (
                <span
                    className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span
                    className="font-semibold text-gray-900 dark:text-white">{ROWS_PER_PAGE * (page - 1) + 1}-{Math.min(ROWS_PER_PAGE * page, issues.length)}</span> of <span
                    className="font-semibold text-gray-900 dark:text-white">{issues.length}</span>
            </span>
            )}
        {pages.length <= 1 ? null : (
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <button onClick={() => setPage(page - 1)} {...(page === 1 ? {disabled: true} : {})}
                            className="flex items-center justify-center px-3 h-8 ms-0 disabled:cursor-not-allowed leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous
                    </button>
                </li>
                {pages.map((pageNumber, index) =>
                    <li>
                        <button onClick={() => setPage(pageNumber)}
                                {...(pageNumber === page ? {ariaCurrent: "page"} : {})}
                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300
                               hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
                               dark:hover:bg-gray-700 dark:hover:text-white">{pageNumber}</button>
                    </li>
                )}
                <li>
                    <button onClick={() => setPage(page + 1)} {...(page === totalPage ? {disabled: true} : {})}
                            className="flex items-center justify-center px-3 h-8 disabled:cursor-not-allowed leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next
                    </button>
                </li>
            </ul>)}
    </nav>);
}

export function IssuesTable({issues, page}) {
    return (
        <div className="lg:p-16 sm:pt-16 sm:pb-16">
            <div className="relative overflow-x-auto sm:rounded-md border-gray-200 border">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 flex items-center bg-gray-50">
                            <div>
                                Status
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100">
                            <div className="flex items-center">
                                Title
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-50">
                            <div className="flex items-center">
                                Priority
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100">
                            <div className="flex items-center">
                                Category
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {issues.slice(ROWS_PER_PAGE * (page - 1), ROWS_PER_PAGE * page).map((row, index) => (<TableRow issue={row} key={index}/>))}
                    </tbody>
                </table>
                {issues.length === 0 ? <div className="bg-red-50 text-gray-700 p-8">No issue found</div> : null}
            </div>
        </div>
    );
}

function TableRow({issue}) {
    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50">
            <td className="px-6 py-4 w-12">
                <div className="flex justify-center">
                    <IssueStatus status={issue.status}/>
                </div>
            </td>
            <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap dark:text-white ">
                <a href={'/issues/' + issue.id.id} className="hover:text-blue-600">
                    {shortString(issue.title, 70)}
                </a>
            </td>

            <td className="px-6 py-4 w-24">
                <div className="flex justify-center">
                    <IssuePriority priority={issue.priority}/>
                </div>
            </td>
            <td className="px-6 py-4 w-24">
                <div className="flex justify-center">
                    {issue.category}
                </div>
            </td>
        </tr>);
}

/*function SortIcon() {
    return (<a href="#">
            <svg className="w-3 h-3 ms-1.5" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
            </svg>
        </a>
    );
}*/

export function IssuePriority({priority}) {
    switch (priority) {
        case "High":
            return <span className="text-red-600">High</span>;
        case "Medium":
            return <span className="text-yellow-600">Medium</span>;
        case "Low":
            return <span className="text-gray-500">Low</span>;
        default:
            return <span className="text-gray-500">{priority}</span>;
    }
}

export function IssueStatus({status, width=16, height=16}) {
    switch (status) {
        case "Open":
            return <svg fill="#28c414" viewBox="0 0 16 16" version="1.1" width={width}
                        height={height} aria-hidden="true">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>;
        default:
            return <svg fill="#8f27ff" viewBox="0 0 16 16" version="1.1" width={width}
                        height={height} aria-hidden="true">
                <path
                    d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path>
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
            </svg>;
    }
}
