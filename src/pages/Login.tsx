import './Login.scss';
import Logo from './../assets/logo.svg';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input';
import { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/Heading';
import { post } from '../utils/Requests';
import type { AuthenticateResponse } from '../interfaces/User';

interface LoginType {
  login: (token: string, userId: string, username: string) => void;
  tab: string;
}

const Login = (props: LoginType) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<
    | 'register-error'
    | 'login-error'
    | 'username-already-used'
    | 'password-short'
    | 'different-password'
    | null
  >();

  const navigate = useNavigate();

  const login = () => {
    if (!username || !password) {
      setError('login-error');
    } else {
      console.log('login');
    }
  };

  const register = async () => {
    if (password && username && confirmPassword) {
      if (password.length < 8) setError('password-short');
      else if (password !== confirmPassword) setError('different-password');
      else {
        const registeringUser = {
          username: username,
          password: password,
          confirmPassword: confirmPassword,
        };

        try {
          const response = (await post(
            '/api/register',
            registeringUser
          )) as AuthenticateResponse;

          if (response) {
            props.login(
              response.token,
              response.user.id,
              response.user.username
            );
            navigate('/');
          } else {
            console.log(response);
            setError('register-error');
          }
        } catch (err) {
          console.error('Error :', err);
          setError('register-error');
        }
      }
    }
  };

  const renderLoginForm = () => {
    return (
      <div className="FormContainer">
        <div className="FormTitle">
          <Heading size={'s'}>{t('login.title')}</Heading>
        </div>
        <div className="FormContent">
          <div className="FormField">
            <Input
              error={error === 'login-error' ? 'login.error' : undefined}
              name={'username'}
              onEnterKeyPress={login}
              title={'form.username.field'}
              placeholder="form.username.placeholder"
              value={username}
              onChange={(str) => {
                if (error) setError(null);
                setUsername(str);
              }}
            />
          </div>
          <div className="FormField">
            <Input
              name={'password'}
              error={error === 'login-error' ? 'login.error' : undefined}
              onEnterKeyPress={login}
              type={'password'}
              title={'form.password.field'}
              placeholder="form.password.placeholder"
              value={password}
              onChange={(str) => {
                if (error) setError(null);
                setPassword(str);
              }}
            />
          </div>
        </div>
        <div className="FormButtons">
          <Button
            disabled={!username || !password}
            size={'large'}
            label={'confirm'}
            onClick={login}
          />
          <Button
            type={'link'}
            label={'login.no'}
            onClick={() => navigate('/register')}
          />
        </div>
      </div>
    );
  };

  const renderRegisterForm = () => {
    return (
      <div className="FormContainer">
        <div className="FormTitle">
          <Heading size={'s'}>{t('register.title')}</Heading>
        </div>
        <div className="FormContent">
          <div className="FormField">
            <Input
              error={
                error === 'register-error'
                  ? 'register.error'
                  : error === 'username-already-used'
                    ? 'form.username.error'
                    : undefined
              }
              name={'username'}
              onEnterKeyPress={register}
              title={'form.username.field'}
              placeholder="form.username.placeholder"
              value={username}
              onChange={(str) => {
                if (error) setError(null);
                setUsername(str);
              }}
            />
          </div>
          <div className="FormField">
            <Input
              name={'password'}
              error={
                error === 'register-error'
                  ? 'register.error'
                  : error === 'password-short'
                    ? 'form.password.error'
                    : undefined
              }
              onEnterKeyPress={register}
              type={'password'}
              title={'form.password.field'}
              placeholder="form.password.placeholder"
              value={password}
              onChange={(str) => {
                if (error) setError(null);
                setPassword(str);
              }}
            />
          </div>
          <div className="FormField">
            <Input
              error={
                error === 'register-error'
                  ? 'register.error'
                  : error === 'different-password'
                    ? 'form.confirm-password.error'
                    : undefined
              }
              name={'confirm-password'}
              onEnterKeyPress={register}
              type={'password'}
              title={'form.confirm-password.field'}
              placeholder="form.confirm-password.placeholder"
              value={confirmPassword}
              onChange={(str) => {
                if (error) setError(null);
                setConfirmPassword(str);
              }}
            />
          </div>
          <div className="FormButtons">
            <Button
              disabled={!username || !password || !confirmPassword}
              size={'large'}
              label={'confirm'}
              onClick={register}
            />
            <Button
              type={'link'}
              label={'register.no'}
              onClick={() => navigate('/login')}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="Login">
      <div className="LoginContainer">
        <div className="LoginLogo" onClick={() => navigate('/')}>
          <img src={Logo} alt={"Logo de l'applicaiton"} />
        </div>
        {props.tab === 'login' ? renderLoginForm() : renderRegisterForm()}
      </div>
    </div>
  );
};

export default Login;
