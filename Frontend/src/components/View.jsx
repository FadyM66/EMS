import { useEffect, useState } from "react"
import { handleViewData } from "../utils/handlers"
import '../assets/style/view.css'

const View = ({ isOpen, which, setIsOpen, viewData, setViewData, id }) => {

    const [loading, setLoading] = useState(true);

    const urls = {
        "company": `http://localhost:8000/company/${id}/`,
        "department": `http://localhost:8000/department/${id}`,
        "employee": `http://localhost:8000/employee/${id}/`,
        "user": `http://localhost:8000/user/${id}/`
    }

    const url = urls[which]

    useEffect(() => {
        if (id) {
            setLoading(true);
            handleViewData(url, setViewData).finally(() => {
                setLoading(false);
            });
        }
    }, [id, url]);

    if (isOpen != 'view') return null;

    return (
        <>
            <div className="card-container">
                <div className="main-card">
                    <div className="data-title">
                        <h1>{viewData?.name || ""}</h1>
                    </div>
                    <div className="datacard">
                        {viewData && Object.keys(viewData).length > 0 ? (
                            <>
                                <div className="data">
                                    {Object.entries(viewData).map(([key, value])=>(
                                        <p className="datarow" key={key}>{key}: <span>{value || "-"}</span></p>
                                    ))}
                                </div>
                            </>
                        ) : (
                            "No data"
                        )}
                        <div className='company-options'>
                            <button className='option-btn' onClick={() => setIsOpen(null)}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default View;