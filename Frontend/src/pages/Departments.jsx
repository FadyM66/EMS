import React, { useEffect, useContext } from 'react';

import DeletePrompt from '../components/DeletePrompt.jsx';
import AddDepartment from '../components/AddDepartment.jsx';
import View from '../components/View.jsx';
import Edit from '../components/Edit.jsx';

import { getData } from '../utils/utils.js';
import { PromptContext, PromptProvider } from '../context/PromptContext.jsx';
import { handleDelete, handleEdit, handleView } from '../utils/handlers.js';

const Departments = () => {

    const { isOpen, setIsOpen,
        data, setData,
        dataState, setDataState,
        selectedId, setSelectedId,
        viewData, setViewData,
        editData, setEditData
    } = useContext(PromptContext);

    useEffect(() => {
        getData("http://localhost:8000/department/", { setData, setDataState })
    },
        []);

    return (
        <>

            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Departments</h1>
                    <p>You can manage departments here</p>
                </div>
                <div className='lower-container'>
                    <div className='btn-container add-container'>
                        <button className='add-btn' onClick={() => setIsOpen('add')}> ADD </button>
                    </div>
                    {data && data.length > 0 ?
                        (

                            data.map((department) =>
                            (
                                <div className='company-container' key={department.id}>
                                    <div className='company-name'>
                                        <h2>{department.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button onClick={() => handleView(setIsOpen, setSelectedId, department.id)}>view</button>
                                        <button onClick={() => handleEdit(setIsOpen, setEditData, department)}>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(setSelectedId, setIsOpen, department.id)}>delete</button>
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
            <DeletePrompt
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                which="department"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/department/', { setData, setDataState })}
            />
            <AddDepartment
                isAdd={isOpen}
                setAdd={setIsOpen}
                refreshData={() => getData('http://localhost:8000/department/', { setData, setDataState })}
            />
            <View
                isOpen={isOpen}
                which="department"
                setIsOpen={setIsOpen}
                viewData={viewData}
                setViewData={setViewData}
                id={selectedId}
            />
            <Edit
                isOpen={isOpen} 
                which="department"
                setIsOpen={setIsOpen}
                editData={editData}
                setEditData={setEditData}
                refreshData={() => getData('http://localhost:8000/department/', { setData, setDataState })}
            />
        </>
    );
}

const DepartmentsWrapper = () => {
    return (
        <PromptProvider>
            <Departments />
        </PromptProvider>
    )
}
export default DepartmentsWrapper;