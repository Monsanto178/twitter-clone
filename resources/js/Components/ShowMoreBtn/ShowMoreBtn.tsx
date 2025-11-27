interface Props {
    fetchAction: (page:string) => void;
    loadFlag: boolean;
    page: string;
}

export const ShowMoreBtn = ({fetchAction, page, loadFlag}:Props) => {
    return (
        <div className="flex justify-center items-center mt-2">
            <button
                onClick={() => {fetchAction(page)}}
                disabled={loadFlag}
                className={`w-40 p-2 rounded-[20px] bg-blue-500 cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600
                    disabled:bg-blue-300 disabled:cursor-not-allowed disabled:text-gray-600`}
            >
                Show more
            </button>
        </div>
    )
}