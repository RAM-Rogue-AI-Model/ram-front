import './ConfirmPopup.scss';
import CloseIcon from './../assets/close.svg';
import Button from './Button';
import { useContext } from 'react';
import PopupContext from '../contexts/PopupContext';
import Heading from './Heading';
import { useTranslation } from 'react-i18next';
import Body from './Body';

interface ConfirmPopupType {
  title: string;
  description: string;
  primaryLabel?: string | null;
  primaryClicked: (param: unknown) => void;
}

const ConfirmPopup = (props: ConfirmPopupType) => {
  const { t } = useTranslation();
  const { closePopup } = useContext(PopupContext);

  return (
    <div className="ConfirmPopup">
      <div className="ConfirmPopupHeader">
        <Heading size={'s'}>{t(props.title)}</Heading>
        <div className="CloseButton">
          <Button type={'nude'} image={CloseIcon} onClick={closePopup} />
        </div>
      </div>
      <div className="ConfirmPopupContent">
        <Body>{t(props.description)}</Body>
      </div>
      <div className="ConfirmPopupButtons">
        <Button
          type={'primary'}
          label={props.primaryLabel ?? 'confirm'}
          onClick={props.primaryClicked}
          size={'large'}
        />
      </div>
    </div>
  );
};

export default ConfirmPopup;
