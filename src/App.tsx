import { useState } from 'react';
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import User from './pages/User';

function App() {
  const [logged, setLogged] = useState<boolean>(false)

  const login = (token:string, userId:string, username:string) => {
    window.localStorage.setItem('authToken', token)
    window.localStorage.setItem('userId', userId)
    window.localStorage.setItem('username', username)

    setLogged(true)
  }

  const logout = () => {
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('userId')
    window.localStorage.removeItem('username')
    window.location.reload()
  }

  return (
    <BrowserRouter basename='/ram/'>
      <Routes>
        <Route path={'/*'} element={<div className='AppContainer'>
          <div className="AppContent">
            <Routes>
              <Route path={'/*'} element={<Home/>}></Route>
              <Route path={'/user'} element={<User/>}></Route>
            </Routes>
          </div>
        </div>}/>
        {!logged && <>
          <Route path={'/login'} element={<Login login={login} tab={'login'}/>}/>
          <Route path={'/register'} element={<Login login={login} tab={'register'}/>}/>
        </>}
      </Routes>
    </BrowserRouter>
  )
}

export default App
