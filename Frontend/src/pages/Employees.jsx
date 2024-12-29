import React, { useEffect, useContext } from 'react';

import DeletePrompt from '../components/DeletePrompt.jsx';
import View from '../components/View.jsx';
import Edit from '../components/Edit.jsx';
import AddEmployee from '../components/AddEmployee.jsx';

import '../assets/style/login.css';
import '../assets/style/companies.css';

import { getData } from '../utils/utils.js';
import { PromptContext, PromptProvider } from '../context/PromptContext.jsx';
import { GeneralContext } from '../context/GeneralContext.jsx';
import { handleDelete, handleEdit, handleView, handleAccount } from '../utils/handlers.js';


const Employeess = () => {
    
    const { navigate } = useContext(GeneralContext);

    const { isOpen, setIsOpen,
        data, setData,
        dataState, setDataState,
        selectedId, setSelectedId,
        viewData, setViewData,
        editData, setEditData
    } = useContext(PromptContext);

    useEffect(() => {
        getData("http://localhost:8000/employee/", { setData, setDataState })
    },
        []);

    return (
        <>
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Employees</h1>
                    <p>You can manage employees here</p>
                </div>
                <div className='lower-container'>
                    <div className='btn-container add-container'>
                        <button className='add-btn' onClick={() => setIsOpen('add')}> ADD </button>
                    </div>
                    {data && data.length > 0 ?
                        (

                            data.map((employee, index) =>
                            (
                                <div className='company-container' key={index}>
                                    <div className='company-name'>
                                        <h2>{employee.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button onClick={
                                            async () => {
                                                const data = await handleAccount(employee.email)
                                                navigate('/user', { state: { data } })
                                            }
                                        }>account</button>
                                        <button onClick={() => handleView(setIsOpen, setSelectedId, employee.id)}>view</button>
                                        <button onClick={() => handleEdit(setIsOpen, setEditData, employee)}>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(setSelectedId, setIsOpen, employee.id)}>delete</button>
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
            <AddEmployee
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                refreshData={() => getData('http://localhost:8000/employee/', { setData, setDataState })}
            />
            <DeletePrompt
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                which="employee"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/employee/', { setData, setDataState })}
            />
            <View
                isOpen={isOpen}
                which="employee"
                setIsOpen={setIsOpen}
                viewData={viewData}
                setViewData={setViewData}
                id={selectedId}
            />
            <Edit
                isOpen={isOpen}
                which="employee"
                setIsOpen={setIsOpen}
                editData={editData}
                setEditData={setEditData}
                refreshData={() => getData('http://localhost:8000/employee/', { setData, setDataState })}
            />
        </>
    );
}

const Employees = () => {
    return (
        <PromptProvider>
            <Employeess />
        </PromptProvider>
    )
}

export default Employees;