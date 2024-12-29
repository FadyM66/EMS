import React, { createContext, useState } from "react";

export const PromptContext = createContext();

export const PromptProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(null)
    const [data, setData] = useState({})
    const [dataState, setDataState] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [isAdd, setAdd] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [deleting, setDeleting] = useState("yes")
    const [viewData, setViewData] = useState(null)
    const [editData, setEditData] = useState(null)

    return (
        <PromptContext.Provider value={{
            isOpen, setIsOpen,
            data, setData,
            dataState, setDataState,
            selectedId, setSelectedId,
            isAdd, setAdd,
            isEdit, setEdit,
            deleting, setDeleting,
            viewData, setViewData,
            editData, setEditData
        }}>
            {children}
        </PromptContext.Provider>
    )
}; 
