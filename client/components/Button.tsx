export default function Button({ text, type ,className, ...props }) {
    return (
        

            <button
                className={` bg-blue-800  p-2 rounded-md ${className}`}
                {...props}
            >
                    {text}
            </button>
            
        
    );
}