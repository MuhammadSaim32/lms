export default function Input({ htmtFor, labelText, className, ...props }) {
    return (
        <div
         >
            <label htmlFor={htmtFor} 
            className="font-bold"
            >{labelText}</label>

            <input
                className={`border border-gray-500 p-2 rounded-md outline-0 ${className}`}
                {...props}
            />
            {props.error &&
                <div className="text-red-500 mt-2">
                    {props.error}
                </div>}
        </div>
    );
}