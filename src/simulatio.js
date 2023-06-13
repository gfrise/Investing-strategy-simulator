import React from "react"
import { mutateArray } from "./Abstractions";
import AppContext from './AppContext'

export function Simulazione() {
    const {state} = React.useContext(AppContext)
    const [soldi, privar, priinv, seltrig, secvar, secinv, trevar, treinv] = state.valori;
    const pricesTable = state.mese;
    
    const investment = {
        pmc: [],
        numQ: [],
        soldiFermi: soldi,
        qtot: () => investment.numQ.reduce((acc, cur) => acc + cur, 0),
        average: () => investment.numQ.reduce((acc, cur, i) => acc + investment.pmc[i] * cur, 0) / investment.qtot() || 0,
        valore: () => investment.average() * investment.qtot()
    }

    let giorni_comprasi = []
    let giorni_vendesi = []
    let control = 0;

    for (let i=0; i < pricesTable.length; i++) {

        const moneyInvested = investment.valore() === 0 ? false : true
        const moneyAvailable = investment.soldiFermi === 0 ? false : true
        const isAbove = pricesTable[i].price / investment.average() > ((seltrig + 100) / 100)
        const reBuy = moneyAvailable && moneyInvested

        function sell() {
            const vendita = pricesTable[i].price * investment.qtot()
            investment.soldiFermi += vendita
            investment.pmc = [];
            investment.numQ = [];
            giorni_vendesi.push(pricesTable[i].date)
            control = 0;
        }

        function buy(x) {
            const quoteComprande = Math.floor((investment.soldiFermi * x) / pricesTable[i].price)
                if (quoteComprande) {
                    const acquisto = quoteComprande * pricesTable[i].price
                    investment.soldiFermi -= acquisto 
                    investment.pmc.push(pricesTable[i].price)
                    investment.numQ.push(quoteComprande)
                    control += 1
                    giorni_comprasi.push(pricesTable[i].date)
                }   
        }

        if (!control && !moneyInvested && pricesTable[i].variation < privar) {
            buy(priinv)
        } else if (moneyInvested && isAbove) {
            sell()
        } else if (control === 1 && reBuy && (pricesTable[i].price < investment.average() * ( 100 + secvar) / 100)) {
            buy(secinv)
        } else if (control === 2 && reBuy && (pricesTable[i].price < investment.average() * ( 100 + trevar) / 100)) {
            buy(treinv)
        } else {}
        
    }

    const quote = investment.numQ
    const prezzi = investment.pmc.slice(0, quote.length)
    const fermi = investment.soldiFermi
    const media = investment.average()
    const qtot = investment.qtot()
    const valtot = investment.valore()
    const attesi = fermi + valtot
    
    const dataIniziale = pricesTable[0].date
    const dataFinale = pricesTable[pricesTable.length-1].date
    const prezzoIniziale = pricesTable[0].price
    const prezzoFinale = pricesTable[pricesTable.length-1].price
    const varAbsolute = (pricesTable[pricesTable.length-1].price)-pricesTable[0].price
    const varRelative = ((prezzoFinale/prezzoIniziale) - 1) * 100
    
    const guadagno = (attesi / soldi - 1)*100
    
    // return {
        //     fitness: round(guadagno - varRelative),
        //     variables: state.valori 
        // }
        
    
    function round(num) {
        return (Math.round(num * 100) / 100)
    }
    
    return (
        <section>
        <summary>
            <h1>Output:</h1>
            <br></br>
                <h3>Andamento mercato dal {dataIniziale} al {dataFinale}:<br/> 
                {round(varAbsolute)}€ | {round(varRelative)}%</h3>
                <br/>
                <h3>Andamento portafoglio: 
                    <br/>da {round(soldi)}€ iniziali ad attesi {round(attesi)}€</h3>
                <br/>
                <h3>Profitto: <br/>{round(attesi-soldi)}€ | {round(guadagno)}% </h3>
                <br/>
                <h3>Soldi iniziali: {round(soldi)}€</h3>
                <h3>Vendi sopra di: {round(seltrig)}%</h3><br/>
                <h3>Compra sotto a: {round(privar)}%</h3>
                <h3>Primo fattore: {round(priinv)}</h3><br/>
                <h3>Compra di nuovo sotto a: {round(secvar)}%</h3>
                <h3>Secondo fattore: {round(secinv)}</h3><br/>
                <h3>Compra infine sotto a: {round(trevar)}</h3>
                <h3>Terzo fattore: {round(treinv)}</h3>

        </summary>
        <aside>
            <h1>Investimento:</h1>
            <br/>
                <h3>Soldi rimasti fermi: {round(fermi)} €</h3> <br/>
                <h3>Prezzo medio quote: {round(media)} €</h3><br/>
                <h3>Numero quote: {qtot}</h3><br/>
                <h3>Valore portafoglio:<br/> {round(valtot)} €</h3><br/>
                <h3>Prezzi a cui le quote sono state comprate: </h3>
                <div className="container">
                    <ul >
                    {prezzi.map((el) => <li>{round(el)} €</li>)}
                    </ul>
                </div>
                <br/>
                <h3>Numero di quote comprate ogni volta: </h3>
                <ul>
                {quote.map((el) => <li>{el}</li>)}
                </ul><br/>
                <h3>Giorni d'acquisto:</h3>
                <div className="days-r">
                {giorni_comprasi.map(el => <p>{el}</p>)}
                </div><br/>
                <h3>Giorni di guadagno:</h3>
                <div className="days">
                {giorni_vendesi.map(el => <p>{el}</p>)}
                </div>
        </aside>
        </section>
    )
}

// function algoritmoGenetico(gen, parameters) {
//     const results = [];
    
//     const parentResult = Simulazione(parameters)
//     results.push(parentResult)
    
//     let i = 0
//     while (i < 9) {
//         const newParams = mutateArray(parameters) 
//         const childResult = Simulazione(newParams)
//         results.push(childResult)
//         i++
//     }
    
//     results.sort((a,b) => (a.fitness > b.fitness) ? 1 : ((b.fitness > a.fitness) ? -1 : 0));
//     const topResults = results.slice(-1);
//     const newestParams = topResults[0].variables;
    
//     if (gen > 0) {
//         return algoritmoGenetico((gen - 1), newestParams)
//     } else {
//         return topResults
//     }
// }
// console.log(algoritmoGenetico(16, parameters))