import { useState } from 'react';
import '../assets/style/confirmprompt.css';
import { handleConfirm, handleCancel } from '../utils/handlers';

const DeletePrompt = ({ isOpen, setIsOpen, which, id, refreshData }) => {

    const [deleting, setDeleting] = useState("yes")

    const urls = {
        "company": `http://localhost:8000/company/delete/${id}`,
        "department": `http://localhost:8000/department/delete/${id}`,
        "employee": `http://localhost:8000/employee/delete/${id}`,
        "user": `http://localhost:8000/user/delete/${id}`
    }

    const url = urls[which]



    if (isOpen != 'delete') return null;

    return (
        <div className="prompt-container">
            <div className="prompt">
                <h3>are you sure to delete it?</h3>
                <div>
                    <button className='prompt-btn' onClick={() => handleConfirm(url, setDeleting, refreshData, setIsOpen)}>{deleting}</button>
                    <button className='prompt-btn' onClick={() => handleCancel(setIsOpen)}>no</button>
                </div>
            </div>
        </div>
    );
};

export default DeletePrompt;