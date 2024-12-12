import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import Username from './Username.jsx';
import '../assets/style/login.css';
import TopBar from './TopBar.jsx';
import '../assets/style/companies.css'
import ConfirmPrompt from './ConfirmPrompt.jsx'
import { getData } from '../assets/utils/utils.js';
import AddDepartment from './AddDepartment.jsx';

const Departments = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [departments, setData] = useState({})
    const [dataState, setDataState] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [isAdd, setAdd] = useState(false)

    useEffect(() => {
        getData("http://localhost:8000/department/", { setData, setDataState })
    },
        []);

    const handleDelete = (id) => {
        setSelectedId(id)
        setIsOpen(true)
    }

    return (
        <>
            <AddDepartment
                isAdd={isAdd}
                setAdd={setAdd}
                refreshData={() => getData('http://localhost:8000/department/', { setData, setDataState })}
            />
            <Logo />
            <TopBar />
            <Username />
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Departments</h1>
                    <p>You can manage departments here</p>
                </div>
                <div className='lower-container'>
                    <a className='addbtn' onClick={() => setAdd(true)}> ADD </a>
                    {departments && departments.length > 0 ?
                        (

                            departments.map((department) =>
                            (
                                <div className='company-container'>
                                    <div className='company-name'>
                                        <h2>{department.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button>view</button>
                                        <button>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(department.id)}>delete</button>
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
                which="department"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/department/', { setData, setDataState })}
            />
        </>
    );
}

export default Departments;