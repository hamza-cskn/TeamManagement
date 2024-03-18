import {IssueBubble} from "./IssueBubble";
import {useState} from "react";
import {authorizedFetch} from "../../auth/AuthHandler";

async function fetchComments(issue, setComments, setError) {
    authorizedFetch(`http://localhost:5229/issue/${issue.id}/comments`)
        .then(res => {
            const data = res.json();
            if (!res.ok) {
                setError(data.message || "We are not able to information for comments.");
                return;
            }
            setComments(data.comments);
        })
        .catch(ex => setError(ex.toString()));
}

export function Comments() {
    /*comments += [
        {writer: "Çağatay EREM", content: "our interns broke the entire system. i think we should cancel their vpn access."},
        {writer: "Aziz AYDIN", content: "i need my tea. i will not work until we have tea in the office."},
        {writer: "Enes YAPMAZ", content: "i checked fast api. it is not related with it."},
        {writer: "Ahmet KESKIN", content: "❤️"},
        {writer: "Sefa AKDAŞ", content: "we have to fix the issue immediately. but let me finish my tea first."}
    ]*/
    const [comments, setComments] = useState(null);
    const [error, setError] = useState(null);
    fetchComments("", setComments, setError);

    if (error)
        return <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
            lol. an error occurred. fix it.
        </section>

    if (!comments)
        return <section className="bg-red-100 dark:bg-gray-900 py-8 font-medium lg:py-16 antialiased text-center">
            Comments are loading...
        </section>

    return (<section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl px-4">
            {comments.map((comment, index) => <IssueBubble content={comment} date={"9 April 2009 19:23"}
                                                           writer={"Steve Jobs"}/>)}
            <div className="ml-10">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
                </div>
                <form>
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
            </div>
        </div>
    </section>)
}