const mese = 
[
    {date: "03/01", variation : 0.96, price : 401.68},
    {date: "04/01", variation : -1.3, price : 396.47},
    {date: "05/01", variation : -3.07, price : 384.29},
    {date: "06/01", variation : -0.07, price : 384.02},
    {date: "07/01", variation : -1.08, price : 379.86},
    {date: "08/01", variation : 0.07, price : 380.11},
]

function average(){
    let sum = 0
    for (let i = 0; i < mese.length; i++){
        sum += mese[i].price
    }
    return sum / mese.length
}
function compareAvg(){
    let avg = average()
    let sum = 0
    for (let i = 0; i < mese.length; i++){
        let x = mese[i].price - avg
        sum += (x * x)
    }
    return sum
}
function deviation(){
    let x = compareAvg() / mese.length
    let i = Math.sqrt(x)
    return i
}
console.log(deviation())

export function algoritmoGenetico(gen, state, boolean) {

    const results = []
    const cache = {}
    
    const parentResult = simulateInv(state, boolean)
    results.push(parentResult)
    
    let i = 0
    while (i < 90) {
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


    results.forEach((res)=> {
        const key = JSON.stringify(res.variables)
        cache[key] = res
    })

    let winners, losers = 0
    Object.values(cache).forEach((res) => {
        if (res.guadagno > 0){
            winners++
        }
    })
    const cacheLen = Object.keys(cache).length
    losers = cacheLen - winners



    if (gen > 0) {
        return algoritmoGenetico((gen - 1), newestState, boolean)
    } else {
        return simulateInv(newestState, false)
    }
}

const nov22 = [
    {date: "06/11", variation : -1.02, price : 275.11},
    {date: "07/11", variation : -3.43, price : 265.68},
    {date: "08/11", variation : -1.95, price : 260.49},
    {date: "09/11", variation : 1.61, price : 264.68},
    {date: "10/11", variation : 1.10, price : 267.59},
]

const fakeState = [1000, -1, 1]

export function MyStrategy(x) {
    const [soldi, ...params] = x
    const pricesTable = nov22

    const investment = {
        pmc: [],
        numQ: [],
        soldiFermi: soldi,
        qtot: () => investment.numQ.reduce((acc, cur) => acc + cur, 0),
        average: () => investment.numQ.reduce((acc, cur, i) => acc + investment.pmc[i] * cur, 0) / investment.qtot() || 0, 
        valore: () => investment.average() * investment.qtot()
    }

    let comprasi = []
    let vendesi = []
    let control = 0
    let maxControl = (params.length - 1) / 4

    function trade(i, x , isBuy) {
        const price = pricesTable[i].price
        const date = pricesTable[i].date 
        const quote = Math.floor((isBuy ? investment.soldiFermi : investment.valore()) * x / price)
        if (quote) {
            const amount = quote * price
            investment.soldiFermi += (isBuy ? -1 : 1) * amount
            investment.pmc.push(price)
            investment.numQ.push((isBuy ? 1 : -1) * quote)
            control += (isBuy ? 1 : -1);
            (isBuy ? comprasi : vendesi).push(date)
        } else if (investment.qtot() === 0){
            investment.pmc = [] 
            investment.numQ = []
        }
    }

    for (let i = 0; i < pricesTable.length; i++) {
        const available = investment.soldiFermi > 0
        const invested = investment.valore() > 0

        const allAvailable = available && !invested
        const allInvested = !available && invested
        const someInvestedAndAvailable = !allAvailable && !allInvested 

        if (!control && allAvailable && pricesTable[i].variation < params[1]) {
            trade(i, params[2], true)
        } else if (control < maxControl && control > 0 && someInvestedAndAvailable && pricesTable[i].price / investment.average() > ((params[5] + 100) / 100)) {
            trade(i, params[6], true)
        } else if (control < maxControl && control > 0 && someInvestedAndAvailable && pricesTable[i].price < investment.average() * ((params[7] + 100) / 100)) {
            trade(i, params[8], false)
        } else if (control === maxControl && allInvested && pricesTable[i].price / investment.average() > ((params[3] + 100) / 100)) {
            trade(i, params[4], false)
        } else {}
    }  
}