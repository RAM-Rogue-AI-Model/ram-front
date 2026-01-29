import { useNavigate, useParams } from 'react-router-dom';
import './Home.scss';
import { useEffect } from 'react';
import Body from '../components/Body';

const Home = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const path = params['*'];
    if (path && path !== '' && path !== 'home') navigate('/');
  }, [params, navigate]);

  return (
    <div className="Home">
      <Body>{'HOME'}</Body>
    </div>
  );
};

export default Home;
