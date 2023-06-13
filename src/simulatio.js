import React from "react"
import AppContext from './AppContext'
import { simulateInv, algoritmoGenetico } from "./Brain"

export function Simulazione() {
    const {state} = React.useContext(AppContext)
    const boolean = state.algoritmo

    const x = !boolean ? simulateInv(state, boolean) : algoritmoGenetico(300, state, boolean);

    function round(num) {
        return Math.round(num * 100) / 100;
    }
    
    return (
        <section>
        <summary>
            <h1>Output:</h1>
            <br></br>
                <h3>Andamento mercato dal {x.dataIniziale} al {x.dataFinale}:<br/> 
                {round(x.varAbsolute)}€ | {round(x.varRelative)}%</h3>
                <br/>
                <h3>Andamento portafoglio: 
                    <br/>da {round(x.soldi)}€ iniziali ad attesi {round(x.attesi)}€</h3>
                <br/>
                <h3>Profitto: <br/>{round(x.attesi-x.soldi)}€ | {round(x.guadagno || 0)}% </h3>
                <br/>
                <h3>Soldi iniziali: {round(x.soldi)}€</h3>
                <h3>Vendi sopra di: {round(x.seltrig)}%</h3><br/>
                <h3>Compra sotto a: {round(x.privar)}%</h3>
                <h3>Primo fattore: {round(x.priinv)}</h3><br/>
                <h3>Compra di nuovo sotto a: {round(x.secvar)}%</h3>
                <h3>Secondo fattore: {round(x.secinv)}</h3><br/>
                <h3>Compra infine sotto a: {round(x.trevar)}</h3>
                <h3>Terzo fattore: {round(x.treinv)}</h3>

        </summary>
        <aside>
            <h1>Investimento:</h1>
            <br/>
                <h3>Soldi rimasti fermi: {round(x.fermi)} €</h3> <br/>
                <h3>Prezzo medio quote: {round(x.media)} €</h3><br/>
                <h3>Numero quote: {x.qtot}</h3><br/>
                <h3>Valore portafoglio:<br/> {round(x.valtot)} €</h3><br/>
                <h3>Prezzi a cui le quote sono state comprate: </h3>
                <div className="container">
                    <ul >
                    {x.prezzi.map((el) => <li>{round(el)} €</li>)}
                    </ul>
                </div>
                <br/>
                <h3>Numero di quote comprate ogni volta: </h3>
                <ul>
                {x.quote.map((el) => <li>{el}</li>)}
                </ul><br/>
                <h3>Giorni d'acquisto:</h3>
                <div className="days-r">
                {x.giorni_comprasi.slice(0, 10).map(el => <p>{el}</p>)}
                </div><br/>
                <h3>Giorni di guadagno:</h3>
                <div className="days">
                {x.giorni_vendesi.slice(0, 10).map(el => <p>{el}</p>)}
                </div>
        </aside>
        </section>
    )
    }