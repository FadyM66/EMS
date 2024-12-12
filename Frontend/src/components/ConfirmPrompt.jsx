import { useState } from 'react';
import '../assets/style/confirmprompt.css';
import fetcher from '../assets/utils/fetcher';

const ConfirmPrompt = ({ isOpen, setIsOpen, which, id, refreshData }) => {

    const [deleting, setDeleting] = useState("yes")
    const urls = {
        "company": `http://localhost:8000/company/delete/${id}`,
        "department": `http://localhost:8000/department/delete/${id}`,
        "employee": `http://localhost:8000/employee/delete/${id}`,
        "user": `http://localhost:8000/user/delete/${id}`
    }

    const url = urls[which]

    const handleConfirm = async (url) => {
        try {
            setDeleting("deleting")
            const { response } = await fetcher(
                url,
                "DELETE"
            )

            if (response.status == 200) {
                setIsOpen(false)
                refreshData()
                setDeleting("yes")
            }
        }
        catch (error) {
            console.log(`error: ${error}`)
        }
    };

    const handleCancel = () => {
        setIsOpen(false)
    }

    if (!isOpen) return null;

    return (
        <div className="prompt-container">
            <div className="prompt">
                <h3>are you sure to delete it?</h3>
                <div>
                    <button className='prompt-btn' onClick={() => handleConfirm(url)}>{deleting}</button>
                    <button className='prompt-btn' onClick={handleCancel}>no</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPrompt;