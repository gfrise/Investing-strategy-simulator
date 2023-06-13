import React, {useMemo, useState} from 'react'
import { GenericInput } from './GenericForm'
import { SpecificInput } from './SpecificInput'
import AppContext from './AppContext'
import { randomizeInputs, options, monthOptions } from './Abstractions'

export function Form() {
    const {state, updateValori, updateMese} = React.useContext(AppContext)

    const [soldiIniziali, setsoldiIniziali] = useState(0)
    const [firstBuyVar, setfirstBuyVar] = useState(0)
    const [primoInvestimento, setprimoInvestimento] = useState(0)
    const [selTrigger, setselTrigger] = useState(0)
    const [secondBuyVar, setsecondBuyVar] = useState(0)
    const [secondoInvestimento, setsecondoInvestimento] = useState(0)
    const [thirdBuyVar, setthirdBuyVar] = useState(0)
    const [terzoInvestimento, setterzoInvestimento] = useState(0)

    const [selected, setSelected] = useState(options[0].value)

    function exportMonth(number) {
        return monthOptions[number];
    }

    const pricesTable = useMemo(() => exportMonth(Number(selected)), [selected])

        function passProps(event) {
            event.preventDefault()
            updateValori([
                Number(soldiIniziali),
                Number(firstBuyVar), Number(primoInvestimento),
                Number(selTrigger),
                Number(secondBuyVar), Number(secondoInvestimento),
                Number(thirdBuyVar), Number(terzoInvestimento),
            ])      
        updateMese(pricesTable)
        }    

        function passRandomProps(event) {
            event.preventDefault()
            let primo = randomizeInputs(0.15, 1)
            let second = randomizeInputs(0, (1 - primo))
            let aiuto = second + primo
            let third = randomizeInputs(0, 1 - aiuto)
            updateValori([
                Number(randomizeInputs(900, 15000)),
                Number(randomizeInputs(-3, -0.6)), Number(primo),
                Number(randomizeInputs(0.1, 5)),
                Number(randomizeInputs(-4, 0)), Number(second),
                Number(randomizeInputs(-4, 0)), Number(third),
            ])
        updateMese(pricesTable)
        }
    
    return (
        <>
    <form onSubmit={passProps}>
        <h2>Inserisci dati:</h2>
            <br/>
                <GenericInput label={"Capitale:"}
                    min={900} max={1000_000} value={soldiIniziali}
                    onChange={e => setsoldiIniziali(e.target.value)}
                />
                <GenericInput label={"Compra se varia di:"}
                    min={-6} max={-0.1} value={firstBuyVar}
                    onChange={(e) => setfirstBuyVar(e.target.value)}
                />
                <GenericInput label={"Vendi se sopra di:"}
                    min={0.01} max={9} value={selTrigger}
                    onChange={(e) => setselTrigger(e.target.value)}
                />
                <GenericInput label={"Investi somma con fattore:"}
                    min={0.01} max={1} value={primoInvestimento}
                    onChange={(e) => setprimoInvestimento(e.target.value)}
                />
            <br/>
            <h3>Seconda Volta:</h3>
                <SpecificInput firstvalue={secondBuyVar} 
                firstonChange={(e) => setsecondBuyVar(e.target.value)}
                secondvalue={secondoInvestimento} 
                secondonChange={(e) => setsecondoInvestimento(e.target.value)} 
                />
            <br/>
            <h3>Terza volta:</h3>
                <SpecificInput firstvalue={thirdBuyVar} 
                firstonChange={(e) => setthirdBuyVar(e.target.value)}
                secondvalue={terzoInvestimento} 
                secondonChange={(e) => setterzoInvestimento(e.target.value)} 
                />
            <br/>
        <label htmlFor="mese">Mese </label>
            <select value={selected} onChange={e => setSelected(e.target.value)}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
                <br/>
            <button onClick={passRandomProps}>Strategia Random</button>
            <button disabled>Algoritmo Genetico</button> 
                <br/>
                <button type="submit">AVVIA</button>
            </form>
        </>
    )
}