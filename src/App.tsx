// import './App.css'
import AppHeader from "./components/app-header/AppHeader.tsx";
import BurgerIngredients from "./components/burger-ingredients/BurgerIngredients.tsx";
import BurgerConstructor from "./components/burger-constructor/BurgerConstructor.tsx";

function App() {

  return (
      <>
          <AppHeader/>
          <div style={{maxWidth: '1240px', display:'flex', margin: 'auto'}}>
              <BurgerIngredients/>
              <BurgerConstructor/>
          </div>

      </>
  )
}

export default App
