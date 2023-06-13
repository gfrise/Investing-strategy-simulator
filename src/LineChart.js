import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import AppContext from './AppContext';

// interface GraphProps {
//   mese: PriceData[];
// }

// export default function Graph({ mese }: GraphProps) {


export default function Graph() {
    const {state} = React.useContext(AppContext)
    const pricesTable = state.mese
    
    return (
        <figure>
    <LineChart
            width={1000}
            height={300}
            data={pricesTable}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="variation" // or strategy
              stroke="#82ca9d" />
          </LineChart>
          </figure>
    )
}