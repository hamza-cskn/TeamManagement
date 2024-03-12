export function ErrorComponent({error, message}) {
    return (
        <div className="bg-gray-50 min-h-screen text-title text-center">
            <h1 className="text-3xl font-bold text-black">We have some problem here</h1>
            {message &&
                <p className="font-medium text-gray-500">{message}</p>
            }
            <p className="font-medium text-gray-500">{error}</p>
        </div>
    );
}