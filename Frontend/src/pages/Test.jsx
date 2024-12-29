import { useEffect, useContext } from "react";
import { AppContext, AppProvider } from "../context/PromptContext";

const TestContext = () => {
    const {
        isOpen, setIsOpen,
        employees, setData,
        dataState, setDataState,
        selectedId, setSelectedId,
        isAdd, setAdd,
        isView, setView,
        isEdit, setEdit
    } = useContext(AppContext)

    useEffect(() => {
        console.log("isOpen:", isOpen);
        console.log("Employees:", employees);
        console.log("Data State:", dataState);
        console.log("Selected ID:", selectedId);
        console.log("isAdd:", isAdd);
        console.log("isView:", isView);
        console.log("isEdit:", isEdit);
    }, [isOpen, employees, dataState, selectedId, isAdd, isView, isEdit]);

    return null;
};

const Test = () => {

    return (
        <AppProvider>
            <TestContext />
        </AppProvider>

    )
}


export default Test;
