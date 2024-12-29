import React, { createContext, useState} from "react";
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

export const GeneralContextProvider = ({children}) => {

    const navigate = useNavigate();

    return(
        <GeneralContext.Provider value={{
            navigate
        }}>
            {children}
        </GeneralContext.Provider>
    )
}; 
