import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Logo from '../components/Logo.jsx';
import Username from '../components/Username.jsx';
import '../assets/style/login.css';
import { loginSchema } from '../assets/schema/schema.js';
import Cookies from 'js-cookie';
import TopBar from '../components/TopBar.jsx';
import '../assets/style/companies.css'
import ConfirmPrompt from '../components/ConfirmPrompt.jsx'
import { getData } from '../utils/utils.js';
import AddCompany from '../components/AddCompany.jsx';

const Companies = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [companies, setData] = useState({})
    const [dataState, setDataState] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [isAdd, setAdd] = useState(false)

    useEffect(() => {
        getData("http://localhost:8000/company/", { setData, setDataState })
    },
        []);

    const handleDelete = (id) => {
        setSelectedId(id)
        setIsOpen(true)
    }

    return (
        <>
            <AddCompany
                isAdd={isAdd}
                setAdd={setAdd}
                refreshData={() => getData('http://localhost:8000/company/', { setData, setDataState })}
            />
            <Logo />
            <TopBar />
            <Username />
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Companies</h1>
                    <p>You can manage comapanies here</p>
                </div>
                <div className='lower-container'>
                    <div className='btn-container add-container'>
                        <button className='add-btn' onClick={() => setAdd(true)}> ADD </button>
                    </div>
                    {companies && companies.length > 0 ?
                        (

                            companies.map((company) =>
                            (
                                <div className='company-container'>
                                    <div className='company-name'>
                                        <h2>{company.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button>view</button>
                                        <button>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(company.id)}>delete</button>
                                    </div>
                                </div>
                            ))
                        )
                        :
                        (
                            <h1>{dataState}</h1>
                        )
                    }
                </div>
            </div>
            <ConfirmPrompt
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                which="company"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/company/', { setData, setDataState })}
            />
        </>
    );
}

export default Companies;