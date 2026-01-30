import { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import User from './pages/User';
import Nav from './components/Nav';
import { get } from './utils/Requests';
import type { UserMeResponse } from './interfaces/User';

function App() {
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    const authToken = window.localStorage.getItem('authToken');
    if (authToken) {
      get('/api/user/me')
        .then((res) => {
          const result = res as UserMeResponse;
          const userId = window.localStorage.getItem('userId');
          if (userId !== result.id)
            window.localStorage.setItem('userId', result.id);
          const username = window.localStorage.getItem('username');
          if (username !== result.username)
            window.localStorage.setItem('username', result.username);
          setLogged(true);
        })
        .catch(() => {
          window.localStorage.removeItem('authToken');
          window.localStorage.removeItem('userId');
          window.localStorage.removeItem('username');
        });
    }
  }, []);

  const login = (token: string, userId: string, username: string) => {
    window.localStorage.setItem('authToken', token);
    window.localStorage.setItem('userId', userId);
    window.localStorage.setItem('username', username);

    setLogged(true);
  };

  const logout = () => {
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <BrowserRouter basename="/ram/">
      <Routes>
        <Route
          path={'/*'}
          element={
            <div className="AppContainer">
              <Nav logged={logged} />
              <div className="AppContent">
                <Routes>
                  <Route path={'/*'} element={<Home />}></Route>
                  {logged && (
                    <Route
                      path={'/user'}
                      element={<User logout={logout} />}
                    ></Route>
                  )}
                </Routes>
              </div>
            </div>
          }
        />
        {!logged && (
          <>
            <Route
              path={'/login'}
              element={<Login login={login} tab={'login'} />}
            />
            <Route
              path={'/register'}
              element={<Login login={login} tab={'register'} />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
