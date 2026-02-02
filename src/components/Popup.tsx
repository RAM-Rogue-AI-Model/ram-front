import { useContext } from 'react';
import './Popup.scss';
import PopupContext from '../contexts/PopupContext';

const Popup = () => {
  const { content, open, full } = useContext(PopupContext);

  return (
    <div className={'Popup' + (open ? ' open' : '') + (full ? ' full' : '')}>
      <div className="PopupContent">{content && content}</div>
    </div>
  );
};

export default Popup;
