type Props={
    id?: number,
    handler: ()=>void,
    onClose: (id?: number)=>void,
    message: string,
    isDeleting: boolean
};

const ConfirmModal = ({id, handler, onClose, message, isDeleting}: Props)=>{

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 opacity-100 pointer-events-auto`}
        >
            <div className="bg-bg1 rounded-lg p-6 w-full max-w-xs shadow-md transform transition-transform duration-200">
                {message && <h2 className="text-xl main-font text-center text-text2 pb-8">{message}</h2>}
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={()=>onClose(id)}
                        className="px-4 py-2 rounded-lg main-thin text-sm bg-text1 text-text2  hover:scale-105  transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handler}
                        className={`px-4 py-2 rounded-lg main-thin text-sm ${isDeleting?'bg-red-500 text-text2':'bg-text2 text-text1'} hover:scale-105 duration-100`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
