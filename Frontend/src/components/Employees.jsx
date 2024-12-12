import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import Username from './Username.jsx';
import '../assets/style/login.css';
import TopBar from './TopBar.jsx';
import '../assets/style/companies.css'
import ConfirmPrompt from './ConfirmPrompt.jsx'
import { getData } from '../assets/utils/utils.js';
import AddEmployee from './AddEmployee.jsx'

const Employees = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [employees, setData] = useState({})
    const [dataState, setDataState] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [isAdd, setAdd] = useState(false)

    useEffect(() => {
        getData("http://localhost:8000/employee/", { setData, setDataState })
    },
        []);

    const handleDelete = (id) => {
        setSelectedId(id)
        setIsOpen(true)
    }

    return (
        <>
            <AddEmployee
                isAdd={isAdd}
                setAdd={setAdd}
                refreshData={() => getData('http://localhost:8000/employee/', { setData, setDataState })}
            />
            <Logo />
            <TopBar />
            <Username />
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Employees</h1>
                    <p>You can manage employees here</p>
                </div>
                <div className='lower-container'>
                    <a className='addbtn' onClick={() => setAdd(true)}> ADD </a>
                    {employees && employees.length > 0 ?
                        (

                            employees.map((employee) =>
                            (
                                <div className='company-container'>
                                    <div className='company-name'>
                                        <h2>{employee.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button>create account</button>
                                        <button>view</button>
                                        <button>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(employee.id)}>delete</button>
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
                which="employee"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/employee/', { setData, setDataState })}
            />
        </>
    );
}

export default Employees;