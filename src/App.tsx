import { BrowserRouter,Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Home from "./component/Home"
import Login from "./pages/Login"
import Chat from "./component/Chat"

function App() {
  return(
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path ='home' element={<Home/>} />
      <Route path='/chat' element={<Chat/>}/>
     
    </Routes>
    </BrowserRouter>
    </>
  )
}
  export default App
