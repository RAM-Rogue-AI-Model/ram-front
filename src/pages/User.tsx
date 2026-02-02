import Button from '../components/Button';
import './User.scss';
import Heading from '../components/Heading.tsx';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input.tsx';
import { useContext, useState } from 'react';
import { patch } from '../utils/Requests.ts';
import PopupContext from '../contexts/PopupContext.tsx';
import PopupContent from '../components/PopupContent.tsx';
import type { UserType } from '../interfaces/User.ts';

interface EditUsernameType {
  value: string;
  closePopup: () => void;
}

const EditUsername = (props: EditUsernameType) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>(props.value ?? '');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<'change-username-error' | null>();

  const onConfirm = async () => {
    if (username && username !== props.value && password) {
      const passwordPayload = {
        username: username,
        password: password,
      };
      const userId = window.localStorage.getItem('userId');
      if (!userId) {
        setError('change-username-error');
      }

      patch(`/api/user/${userId}/rename`, passwordPayload)
        .then((res) => {
          if (res) {
            const data = res as UserType;
            window.localStorage.setItem('username', data.username);
            props.closePopup();
          } else {
            setError('change-username-error');
          }
        })
        .catch((err) => {
          console.error('Error :', err);
          setError('change-username-error');
        });
    }
  };

  return (
    <div className="EditPopup">
      <PopupContent
        title={'account.change-username.title'}
        confirm={{
          action: onConfirm,
          disabled: username === props.value || !username || !password,
        }}
        close={{
          action: props.closePopup,
        }}
      >
        <div className="EditPopupContainer">
          <div className={'AccountInput'}>
            <Input
              error={
                error === 'change-username-error'
                  ? 'account.change-username.error'
                  : undefined
              }
              title={t('account.change-username.field')}
              placeholder={t('form.username.placeholder')}
              value={username}
              onEnterKeyPress={onConfirm}
              onChange={setUsername}
              name={'username'}
            />
          </div>
          <div className={'AccountInput'}>
            <Input
              error={
                error === 'change-username-error'
                  ? 'account.change-username.error'
                  : null
              }
              title={t('form.password.field')}
              type={'password'}
              value={password}
              onEnterKeyPress={onConfirm}
              onChange={setPassword}
              name={'password'}
            />
          </div>
        </div>
      </PopupContent>
    </div>
  );
};

const EditPassword = (props: { closePopup: () => void }) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<
    | 'password-short'
    | 'different-password'
    | 'change-password-error'
    | 'not-connected'
    | null
  >();

  const changePassword = async () => {
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword.length < 8) setError('password-short');
      else if (newPassword !== confirmPassword) setError('different-password');
      else {
        const passwordPayload = {
          password: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        };
        const userId = window.localStorage.getItem('userId');
        if (!userId) {
          setError('change-password-error');
        }
        try {
          const response = (await patch(
            `/api/user/${userId}/password`,
            passwordPayload
          )) as Response;

          if (response) {
            props.closePopup();
          } else {
            setError('change-password-error');
          }
        } catch (err) {
          console.error('Error :', err);
          setError('change-password-error');
        }
      }
    }
  };

  return (
    <div className="EditPopup">
      <PopupContent
        title={'account.change-password.title'}
        confirm={{
          action: changePassword,
          disabled: !oldPassword || !newPassword || !confirmPassword,
        }}
        close={{
          action: props.closePopup,
        }}
      >
        <div className="EditPopupContainer">
          <div className={'AccountInput'}>
            <Input
              error={
                error === 'change-password-error'
                  ? 'account.change-password.error'
                  : undefined
              }
              title={t('account.password.label')}
              type={'password'}
              value={oldPassword}
              onEnterKeyPress={changePassword}
              onChange={setOldPassword}
              name={'oldPassword'}
            />
          </div>
          <div className={'AccountInput'}>
            <Input
              error={
                error === 'change-password-error'
                  ? 'account.change-password.error'
                  : error === 'password-short'
                    ? 'form.password.error'
                    : undefined
              }
              title={t('account.change-password.field')}
              type={'password'}
              value={newPassword}
              onEnterKeyPress={changePassword}
              onChange={setNewPassword}
              name={'newPassword'}
            />
          </div>
          <div className={'AccountInput'}>
            <Input
              error={
                error === 'change-password-error'
                  ? 'account.change-password.error'
                  : error === 'different-password'
                    ? 'form.confirm-password.error'
                    : undefined
              }
              title={t('form.confirm-password.field')}
              type={'password'}
              value={confirmPassword}
              onEnterKeyPress={changePassword}
              onChange={setConfirmPassword}
              name={'confirmPassword'}
            />
          </div>
        </div>
      </PopupContent>
    </div>
  );
};

const User = (props: { logout: () => void }) => {
  const { t } = useTranslation();
  const { openPopup, closePopup } = useContext(PopupContext);

  const openChangePasswordPopup = () => {
    openPopup(<EditPassword closePopup={closePopup} />, false);
  };

  const openChangeUsernamePopup = () => {
    openPopup(
      <EditUsername
        value={window.localStorage.getItem('username') ?? ''}
        closePopup={closePopup}
      />,
      false
    );
  };

  return (
    <div className="User">
      <div className="UserContainer">
        <Heading size={'m'}>{t('account.title')}</Heading>
        <div className="UserFormContainer">
          <div className={'UserInput'}>
            <div className={'AccountInput'}>
              <Input
                title={t('account.username.label')}
                type={'text'}
                value={window.localStorage.getItem('username') ?? ''}
                disabled
                onChange={() => {}}
                name={'username'}
              />
            </div>
            <div className={'AccountButton'}>
              <Button
                type={'secondary'}
                size={'large'}
                full
                label={t('account.username.change')}
                onClick={openChangeUsernamePopup}
              />
            </div>
          </div>
          <div className={'UserInput'}>
            <div className={'AccountInput'}>
              <Input
                title={t('account.password.label')}
                type={'password'}
                value={'********'}
                disabled
                onChange={() => {}}
                name={'password'}
              />
            </div>
            <div className={'AccountButton'}>
              <Button
                type={'secondary'}
                size={'large'}
                label={t('account.password.change')}
                onClick={openChangePasswordPopup}
              />
            </div>
          </div>
        </div>
        <div className={'UserButtonsContainer'}>
          <Button
            size={'large'}
            label={t('account.logout')}
            onClick={props.logout}
          />
          <Button
            size={'large'}
            disabled
            label={t('account.delete')}
            onClick={props.logout}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
