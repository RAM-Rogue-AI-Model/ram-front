import { useNavigate, useParams } from 'react-router-dom';
import './Home.scss';
import { useEffect, useState } from 'react';
import Heading from '../components/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input';
import Body from '../components/Body';
import NumberInput from '../components/NumberInput';
import Button from '../components/Button';

const Home = (props: { logged: boolean }) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [pv, setPV] = useState<number>(1);
  const [atk, setATK] = useState<number>(1);
  const [spe, setSPE] = useState<number>(1);

  useEffect(() => {
    console.log('PV : ', pv);
  }, [pv]);

  useEffect(() => {
    const path = params['*'];
    if (path && path !== '' && path !== 'home') navigate('/');
  }, [params, navigate]);

  const beginGame = () => {
    console.log('beginGame');
  };

  return (
    <div className="Home">
      <div className="HomeContainer">
        <Heading size={'m'}>{t('home.creation.title')}</Heading>
        <div className="HomeContent">
          <div className="CreationField">
            <Input
              name={'name'}
              title={'home.creation.name.title'}
              placeholder={'home.creation.name.placeholder'}
              value={name}
              onChange={(str: string) => setName(str)}
            />
          </div>
          <div className="CreationField">
            <Body weight={'bold'}>{t('home.creation.stats.title')}</Body>
            <div className="CreationInputs">
              <NumberInput
                name={'pv'}
                title={'home.creation.stats.health.title'}
                min={1}
                value={pv}
                onChange={(nbr: number) => setPV(nbr)}
              />
              <NumberInput
                name={'atk'}
                title={'home.creation.stats.attack.title'}
                min={1}
                value={atk}
                onChange={(nbr: number) => setATK(nbr)}
              />
              <NumberInput
                name={'vit'}
                title={'home.creation.stats.speed.title'}
                min={1}
                value={spe}
                onChange={(nbr: number) => setSPE(nbr)}
              />
            </div>
          </div>
          <div className="CreationField">
            <Button
              size={'large'}
              label={t('home.creation.begin')}
              onClick={beginGame}
            />
          </div>
        </div>
      </div>
      {props.logged && (
        <div className="HomeContainer">
          <Heading size={'m'}>{t('home.games.title')}</Heading>
        </div>
      )}
    </div>
  );
};

export default Home;
