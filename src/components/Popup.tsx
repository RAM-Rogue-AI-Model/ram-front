import { useContext } from 'react';
import './Popup.scss';
import PopupContext from '../contexts/PopupContext';

const Popup = () => {
  const { content, open, full } = useContext(PopupContext);

  return (
    <div
      className={
        'PopupContainer' + (open ? ' open' : '') + (full ? ' full' : '')
      }
    >
      <div className="Popup">{content && content}</div>
    </div>
  );
};

export default Popup;
