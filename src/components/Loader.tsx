import Body from './Body';
import './Loader.scss';
import LoadingIcon from './../assets/loading.svg';
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();

  return (
    <div className="LoaderContainer">
      <div className="LoaderContent">
        <div className="LoaderImg">
          <img src={LoadingIcon} alt="Loading icon" />
        </div>
        <Body>{t('loading')}</Body>
      </div>
    </div>
  );
};

export default Loader;
