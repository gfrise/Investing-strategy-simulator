import { gennaio, febbraio, marzo, gennaio_2021, agosto, settembre, ottobre, aprile, novembre, giugno, maggio, anno, luglio } from './Months'

const round = num => Math.round(num * 100) / 100;
const randomInInterval = (small, big) => round((Math.random() * (big - small)) - small)
const randomInIntervalBig = (small, big) => round(big - (Math.random() * Math.random()) * (big - small))
const randomInIntervalSmall = (small, big) => round(Math.random() * Math.random() * (big - small) + small)

function newRandom(num, small, big) {
    const x = Math.random() < 0.5 ? 1 : -1
    if (x === 1) {
        return randomInIntervalSmall(num, big)
    } else {
        return randomInIntervalBig(small, num)
    }
}

export function mutateArray(x) {
    const result = []
    result.push(x[0])
    const firstBuyVar = Number(newRandom(x[1], -7,  -0.05));
    result.push(firstBuyVar)
    const firstInv = Number(newRandom(x[2], 0.01, 1))
    result.push(firstInv)
    const sellTrigger = Number(newRandom(x[3], 0.05, 7))
    result.push(sellTrigger)
    const secondBuyVar = Number(newRandom(x[4], -7, 0));
    result.push(secondBuyVar)
    const secondInv = Number(newRandom(x[5], 0, (1 - firstInv)))
    result.push(secondInv)
    const thirdBuyVar = Number(newRandom(x[6], -7, 0))
    result.push(thirdBuyVar)
    const thirdInv = Number(newRandom( x[7], 0, (1 - (firstInv + secondInv))))
    result.push(thirdInv)
 
    return result
} 

function createMonth(Initial_price = 10) {
    let primo_prezzo = Initial_price
    function randomize(small, big) { // (small: number, big: number) 
        return Math.random() * (big - small) + small
    }
    const prices = [];
        for (let i = 1; i < 32; i++) {
            let instances_random = randomize(-2 , 2)
            let prezzo_con_variazione = primo_prezzo + (primo_prezzo / 100 * instances_random)
            prices.push({date: i + '/14', strategy: 0, variation: instances_random, price: prezzo_con_variazione}) 
      primo_prezzo = (prices[i-1].price)
    }
    return prices
}

export function randomizeInputs(small, big) {
    return Math.random() * (big - small) + small
}

export const options = [
    {value: 4, text: '04/22'},
    {value: 5, text: '05/22'},
    {value: 6, text: '06/22'},
    {value: 7, text: '07/22'},
    {value: 10, text: '10/22'},
    {value: 11, text: '11/11'},
    {value: 14, text: 'Simula'},
    {value: 15, text: 'Anno'}
]

export const monthOptions = {
    10: ottobre,
    6: giugno,
    5: maggio,
    4: aprile,
    15: anno,
    11: novembre,
    7: luglio,
    14: createMonth()
  };