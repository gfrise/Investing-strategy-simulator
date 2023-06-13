import Graph from "./LineChart";
import { Simulazione } from "./simulatio";
import AppProvider from "./AppProvider";
import { Form } from "./Form";
import "./App.scss"

function App() {
  return (
    <div>
      <AppProvider>
      <header>Market Crusher</header>
        <Graph />
        <main>
          <Form /> 
          <Simulazione />
        </main>
      </AppProvider>
    </div>
  );
}

export default App;
