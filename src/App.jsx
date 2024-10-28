import "./App.css";
import { useUser } from "./contexts/UserContext.jsx";
import Login from './pages/Login.jsx';

const App = () => {
  const { user } = useUser();

  return (
    <>
      {
        user
          ? <Home />
          : <Login />
      }
    </>
  )
}

export default App;
