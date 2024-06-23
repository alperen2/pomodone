import toast, { ToastOptions } from 'react-hot-toast';

export const notify = ( message:string, type: "success" | "error" ) => {
    const options:ToastOptions = {
        position: "bottom-right",
        style: {
            width: "250px",
            fontSize: "20px",
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    }
    
    if (type === "success") {
        toast.success(message, options)
    } else if(type === "error") {
        toast.error(message, options)    
    }
};