import {mutateArray} from "./Abstractions" 

export function simulateInv(state, boolean) {
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
    const fermi = investment.soldiFermi
    const valtot = investment.valore()
    const attesi = fermi + valtot
    const quote = investment.numQ
    const prezzi = investment.pmc.slice(0, quote.length)
    const media = investment.average()
    const qtot = investment.qtot()
    
    const dataIniziale = pricesTable[0].date
    const dataFinale = pricesTable[pricesTable.length-1].date
    const prezzoIniziale = pricesTable[0].price
    const prezzoFinale = pricesTable[pricesTable.length-1].price
    const varAbsolute = (pricesTable[pricesTable.length-1].price)-pricesTable[0].price
    const varRelative = ((prezzoFinale/prezzoIniziale) - 1) * 100
    
    const guadagno = (attesi / soldi - 1)*100

    function round(num) {
        return Math.round(num * 100) / 100;
    }

    if (boolean) {
        return {
            fitness: round(guadagno - varRelative),
            variables: state.valori
        }
    } else {
        const result = {
            guadagno,
            varRelative,
            fermi,
            media,
            qtot,
            valtot,
            prezzi,
            quote,
            giorni_comprasi,
            giorni_vendesi,
            dataIniziale,
            dataFinale,
            varAbsolute,
            attesi,
            soldi,
            seltrig,
            privar,
            priinv,
            secvar,
            secinv,
            trevar,
            treinv
        }
        return result
    }
}

export function algoritmoGenetico(gen, state, boolean) {

    const results = [];
    
    const parentResult = simulateInv(state, boolean)
    results.push(parentResult)
    
    let i = 0
    while (i < 900) {
        const newParams = mutateArray(state.valori) 
        const newState = {
            ...state,
            valori: newParams
        }
        const childResult = simulateInv(newState, boolean)
        results.push(childResult)
        i++
    }
    
    results.sort((a,b) => (a.fitness > b.fitness) ? 1 : ((b.fitness > a.fitness) ? -1 : 0));
    const topResults = results.slice(-1);
    const newestParams = topResults[0].variables;

    const newestState = {
        ...state,
        valori: newestParams
    }
    
    if (gen > 0) {
        return algoritmoGenetico((gen - 1), newestState, boolean)
    } else {
        return simulateInv(newestState, false)
    }
}