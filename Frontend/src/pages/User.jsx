import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

const User = () => {

    const location = useLocation();
    const [data, setData] = useState(null)

    useEffect(
        () => {
            const user = location.state?.data;
            setData(user)
        }, []
    )
    return (
        <>
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>User</h1>
                    <p>You can manage user account here</p>
                    {data != 404 ? (
                        <div>
                            <p>Name: {data?.detail.data.user.username || "no"}</p>
                            <p>Email: {data?.detail.data.user.email || "no"}</p>
                            <p>Role: {data?.detail.data.user.role || "no"}</p>
                        </div>
                    ) : (
                        <p>No Data</p>
                    )}
                </div>
                <div className='lower-container'>
                    <div className='btn-container add-container'>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User;