export function MessageBubble({content, writer, date, self= false}) {
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
                <p className="text-sm py-2.5 pl-4 text-gray-700 font-medium dark:text-white">
                    {content}
                </p>
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