import React from "react"
import AppContext from "./AppContext" 
import {aprile} from "./Months"

function AppProvider({children}) {

    const [info, setInfo] = React.useState({
        mese: aprile,
        valori: [0, 0, 0, 0, 0, 0, 0, 0],
        algoritmo: false
    })
    
    function updateMese(newData) {
        setInfo((previous) => ({
            ...previous,
            mese: newData
        }))
    }

    function updateValori(newNums) {
        setInfo((previous) => ({
            ...previous,
            valori: newNums
        }))
    }

    function updateBool(newBool) {
        setInfo((prev) => ({
            ...prev,
            algoritmo: newBool
        }))
    }

    const contextValue = {
        state: info,
        updateMese, 
        updateValori,
        updateBool
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider