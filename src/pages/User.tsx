import Button from '../components/Button';
import './User.scss';
import Heading from '../components/Heading.tsx';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input.tsx';
import { useContext, useState } from 'react';
import { post } from '../utils/Requests.ts';
import PopupContext from '../contexts/PopupContext.tsx';

interface EditPasswordProps {
  closeProps: () => void;
}
const EditPassword = (props: EditPasswordProps) => {
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
          setError('not-connected');
        }
        try {
          const response = (await post(
            `/api/user/${userId}/password`,
            passwordPayload
          )) as Response;

          if (response) {
            props.closeProps();
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
    <div className="EditPassword">
      <Heading size={'m'}>{t('account.title')}</Heading>
      <div className={'AccountInput'}>
        <Input
          title={t('account.password.label')}
          type={'password'}
          value={oldPassword}
          onChange={setOldPassword}
          name={'oldPassword'}
        />
      </div>
      <div className={'AccountInput'}>
        <Input
          error={
            error === 'change-password-error'
              ? 'change-password.error'
              : error === 'password-short'
                ? 'form.password.error'
                : undefined
          }
          title={t('account.password.label')}
          type={'password'}
          value={newPassword}
          onChange={setNewPassword}
          name={'newPassword'}
        />
      </div>
      <div className={'AccountInput'}>
        <Input
          error={
            error === 'change-password-error'
              ? 'change-password.error'
              : error === 'different-password'
                ? 'form.confirm-password.error'
                : undefined
          }
          title={t('account.password.label')}
          type={'password'}
          value={confirmPassword}
          onChange={setConfirmPassword}
          name={'confirmPassword'}
        />
      </div>
      <Button
        type={'primary'}
        size={'large'}
        label={t('change-password.button')}
        onClick={changePassword}
      />
    </div>
  );
};
const User = (props: { logout: () => void }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { openPopup, closePopup } = useContext(PopupContext);

  const openChangePasswordPopup = () => {
    openPopup(<EditPassword closeProps={closePopup} />, true);
  };

  return (
    <div className="User">
      <Heading size={'m'}>{t('account.title')}</Heading>

      <div className={'UserInput'}>
        <div className={'AccountInput'}>
          <Input
            title={t('account.username.label')}
            type={'text'}
            value={username}
            onChange={setUsername}
            name={'username'}
          />
        </div>
        <div className={'AccountButton'}>
          <Button
            type={'secondary'}
            size={'large'}
            label={t('account.username.change')}
            onClick={() => {}}
          />
        </div>
      </div>
      <div className={'UserInput'}>
        <div className={'AccountInput'}>
          <Input
            title={t('account.password.label')}
            type={'password'}
            value={password}
            onChange={setPassword}
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
      <div className={'UserInput'}>
        <Button
          size={'large'}
          label={t('account.logout')}
          onClick={props.logout}
        />
        <Button
          size={'large'}
          label={t('account.delete')}
          onClick={props.logout}
        />
      </div>
    </div>
  );
};

export default User;
