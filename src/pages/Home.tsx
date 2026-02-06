import { useNavigate, useParams } from 'react-router-dom';
import './Home.scss';
import { useContext, useEffect, useState } from 'react';
import Heading from '../components/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input';
import Body from '../components/Body';
import NumberInput from '../components/NumberInput';
import Button from '../components/Button';
import { del, get, post } from '../utils/Requests';
import TrashIcon from './../assets/trash.svg';
import type { PlayerInput, PlayerType } from '../interfaces/Player';
import PopupContext from '../contexts/PopupContext';
import ConfirmPopup from '../components/ConfirmPopup';
import type { GameType } from '../interfaces/Game';

const Home = (props: { logged: boolean }) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { openPopup, closePopup } = useContext(PopupContext);

  const [name, setName] = useState<string>('');
  const [pv, setPV] = useState<number>(1);
  const [atk, setATK] = useState<number>(1);
  const [spe, setSPE] = useState<number>(1);

  const maxStats = 50;

  const [players, setPlayers] = useState<PlayerType[]>([]);

  const fetchPlayers = () => {
    const userId = window.localStorage.getItem('userId');
    if (userId) {
      get(`/api/player?userId=${userId}`)
        .then((players) => {
          const data = players as PlayerType[];
          setPlayers(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    const path = params['*'];
    if (path && path !== '' && path !== 'home' && path !== 'user')
      navigate('/');
  }, [params, navigate]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const beginGame = () => {
    const userId = window.localStorage.getItem('userId');
    if (userId && name && pv && atk && spe && pv + atk + spe === maxStats) {
      const newPlayer: PlayerInput = {
        name: name,
        pv: pv,
        attack: atk,
        speed: spe,
        user_id: userId,
      };

      post('/api/player', newPlayer)
        .then(() => {
          setName('');
          setPV(1);
          setATK(1);
          setSPE(1);
          fetchPlayers();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const startGame = (player: PlayerType) => {
    if (player.current_game_id)
      navigate(`/game/${player.current_game_id}/player/${player.id}`);
    else {
      const gameProps = {
        pv: player.pv,
        playerId: player.id,
      };
      post('/api/game', gameProps)
        .then((res) => {
          if (res) {
            const game = res as GameType;
            navigate(`/game/${game.id}/player/${player.id}`);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDeletePlayer = (player: PlayerType) => {
    openPopup(
      <ConfirmPopup
        title={'home.games.delete.title'}
        description={t('home.games.delete.description', { name: player.name })}
        primaryClicked={() => {
          onDeletedPlayer(player.id);
          closePopup();
        }}
      />,
      false
    );
  };

  const onDeletedPlayer = (id: string) => {
    del('/api/player/' + id)
      .then(() => {
        fetchPlayers();
      })
      .catch((err) => {
        console.error(err);
      });
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
            <Body weight={'bold'}>
              {t('home.creation.stats.title', {
                points: maxStats - (pv + atk + spe),
              })}
            </Body>
            <div className="CreationInputs">
              <NumberInput
                name={'pv'}
                title={'home.creation.stats.health.title'}
                min={1}
                max={maxStats - (atk + spe)}
                value={pv}
                onChange={(nbr: number) => setPV(nbr)}
              />
              <NumberInput
                name={'atk'}
                title={'home.creation.stats.attack.title'}
                min={1}
                max={maxStats - (pv + spe)}
                value={atk}
                onChange={(nbr: number) => setATK(nbr)}
              />
              <NumberInput
                name={'vit'}
                title={'home.creation.stats.speed.title'}
                min={1}
                max={maxStats - (atk + pv)}
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
              disabled={
                !name || !pv || !atk || !spe || pv + atk + spe !== maxStats
              }
            />
          </div>
        </div>
      </div>
      {props.logged && (
        <div className="HomeContainer">
          <Heading size={'m'}>{t('home.games.title')}</Heading>
          <div className="Table">
            <div className="TableHeader">
              <div className="TableCase">
                <Body>{t('home.games.table.n')}</Body>
              </div>
              <div className="TableCase">
                <Body>{t('home.games.table.name')}</Body>
              </div>
              <div className="TableCase">
                <Body>{t('home.games.table.pv')}</Body>
              </div>
              <div className="TableCase">
                <Body>{t('home.games.table.pa')}</Body>
              </div>
              <div className="TableCase">
                <Body>{t('home.games.table.spe')}</Body>
              </div>
              <div className="TableCase">
                <Body>{t('home.games.table.date')}</Body>
              </div>
              <div className="TableCase"></div>
              <div className="TableCase"></div>
            </div>
            {players.length > 0 ? (
              <div className="TableContent">
                {players.map((player: PlayerType, playerId: number) => (
                  <div className="TableColumn" key={'player-col-' + playerId}>
                    <div className="TableCase">
                      <Body>
                        {t('home.games.table.nx', { count: playerId + 1 })}
                      </Body>
                    </div>
                    <div className="TableCase">
                      <Body overflow maxWidth={'100%'}>
                        {player.name}
                      </Body>
                    </div>
                    <div className="TableCase">
                      <Body>{player.pv}</Body>
                    </div>
                    <div className="TableCase">
                      <Body>{player.attack}</Body>
                    </div>
                    <div className="TableCase">
                      <Body>{player.speed}</Body>
                    </div>
                    <div className="TableCase">
                      <Body>{new Date().toLocaleDateString()}</Body>
                    </div>
                    <div className="TableCase">
                      <Button
                        type={'primary'}
                        label={
                          player.current_game_id
                            ? 'home.games.continue'
                            : 'home.games.launch'
                        }
                        onClick={() => startGame(player)}
                      />
                    </div>
                    <div className="TableCase">
                      <Button
                        type={'nude'}
                        image={TrashIcon}
                        onClick={() => handleDeletePlayer(player)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="TableContent">
                <div className="TableEmpty">
                  <Body>{t('home.games.empty')}</Body>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
