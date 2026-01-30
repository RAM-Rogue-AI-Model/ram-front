import Body from '../components/Body';
import Button from '../components/Button';
import './User.scss';

const User = (props: { logout: () => void }) => {
  return (
    <div className="User">
      <Body>{'USER'}</Body>
      <Button label={'disconnect'} onClick={props.logout} />
    </div>
  );
};

export default User;
