import './Nav.scss';
import Logo from './../assets/logo.svg';
import Burger from './../assets/burger.svg';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { useEffect, useRef, useState } from 'react';
import Body from './Body';

const Nav = (props: { logged: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const pages: Array<{ tab: string; label: string }> = [
    { tab: '', label: 'home.title' },
    { tab: 'user', label: 'user.title' },
  ];

  const [opened, setOpened] = useState(false);
  const openedRef = useRef(opened);

  useEffect(() => {
    if (props.logged) setOpened(false);
  }, [props.logged, setOpened]);

  const onOptionClicked = (tab: string) => {
    setOpened(false);
    openedRef.current = false;
    navigate('/' + tab);
  };

  return (
    <nav className="Nav">
      <div className="NavBar">
        <div
          className="NavBarContent pointer"
          onClick={() => {
            navigate('/');
          }}
        >
          <div className="NavLogo">
            <img src={Logo} />
          </div>
          <Heading size={'l'}>{t('ram')}</Heading>
        </div>
        <div className="NavBarContent">
          {!props.logged ? (
            <Button
              size={'large'}
              label={'login.label'}
              type={'secondary'}
              onClick={() => navigate('/login')}
            />
          ) : (
            <Button
              size={'large'}
              image={Burger}
              type={'nude'}
              onClick={() => {
                setOpened(!openedRef.current);
                openedRef.current = !openedRef.current;
              }}
            />
          )}
        </div>
        <div className={'BurgerContainer' + (opened ? ' opened' : '')}>
          {pages.map((page, pageId) => (
            <div
              className="NavOption"
              key={'page-' + pageId}
              onClick={() => onOptionClicked(page.tab)}
            >
              <Body hoverable>{t(page.label)}</Body>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
