import React, { useEffect, useContext } from 'react';

import DeletePrompt from '../components/DeletePrompt.jsx';
import AddCompany from '../components/AddCompany.jsx';
import View from '../components/View.jsx';
import Edit from '../components/Edit.jsx';

import '../assets/style/login.css';
import '../assets/style/companies.css';

import { getData } from '../utils/utils.js';
import { PromptContext, PromptProvider } from '../context/PromptContext.jsx';
import { handleDelete, handleEdit, handleView } from '../utils/handlers.js';

const Companies = () => {

    const { isOpen, setIsOpen,
        data, setData,
        dataState, setDataState,
        selectedId, setSelectedId,
        viewData, setViewData,
        editData, setEditData
    } = useContext(PromptContext);

    useEffect(() => {
        getData("http://localhost:8000/company/", { setData, setDataState })
    },
        []);

    return (
        <>
            <div className='data-container'>
                <div className="upper-intro">
                    <h1>Companies</h1>
                    <p>You can manage comapanies here</p>
                </div>
                <div className='lower-container'>
                    <div className='btn-container add-container'>
                        <button className='add-btn' onClick={() => setIsOpen('add')}> ADD </button>
                    </div>
                    {data && data.length > 0 ?
                        (
                            data.map((company, index) =>
                            (
                                <div className='company-container' key={index}>
                                    <div className='company-name'>
                                        <h2>{company.name}</h2>
                                    </div>
                                    <div className='btn-container'>
                                        <button onClick={() => handleView(setIsOpen, setSelectedId, company.id)}>view</button>
                                        <button onClick={() => handleEdit(setIsOpen, setEditData, company)}>edit</button>
                                        <button id='delete-btn' onClick={() => handleDelete(setSelectedId, setIsOpen, company.id)}>delete</button>
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
                which="company"
                id={selectedId}
                refreshData={() => getData('http://localhost:8000/company/', { setData, setDataState })}
            />
            <AddCompany
                isAdd={isOpen}
                setAdd={setIsOpen}
                refreshData={() => getData('http://localhost:8000/company/', { setData, setDataState })}
            />
            <View
                isOpen={isOpen}
                which="company"
                setIsOpen={setIsOpen}
                viewData={viewData}
                setViewData={setViewData}
                id={selectedId}
            />
            <Edit
                isOpen={isOpen}
                which="company"
                setIsOpen={setIsOpen}
                editData={editData}
                setEditData={setEditData}
                refreshData={() => getData('http://localhost:8000/company/', { setData, setDataState })}
            />
        </>
    );
}


const CompaniesWrapper = () => {
    return (
        <PromptProvider>
            <Companies />
        </PromptProvider>
    )
}
export default CompaniesWrapper;