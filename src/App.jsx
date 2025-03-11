import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import ListPinjaman from './pages/ListPinjaman'
import Login from './pages/Login'
import Register from './pages/Register'
import './index.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/list-loan' element={<ListPinjaman/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
