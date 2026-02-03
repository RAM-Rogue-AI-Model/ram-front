import type { ReactNode } from 'react';
import Heading from './Heading';
import './PopupContent.scss';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import CloseIcon from './../assets/close.svg'

interface PopupContentType {
  title: string;
  children: ReactNode;
  confirm?: {
    label?: string | null;
    action: (param: unknown) => void;
    disabled?: boolean | null;
  } | null;
  close?: {
    label?: string | null;
    action: (param: unknown) => void;
    cross?:boolean|null
  } | null;
}

const PopupContent = (props: PopupContentType) => {
  const { t } = useTranslation();

  return (
    <div className="PopupContent">
      <div className="PopupContentHeader">
        <Heading size={'s'}>{t(props.title)}</Heading>
        {(props.close && props.close.cross) && <div className="CloseIcon">
          <Button
            type={"nude"}
            image={CloseIcon}
            onClick={props.close.action}
          />
        </div>}
      </div>
      <div className="divider"></div>
      <div className="PopupContentChildren">{props.children}</div>
      {(props.confirm ?? (props.close && !props.close.cross)) && (
        <>
          <div className="divider"></div>
          <div className="PopupContentButtons">
            {props.close && (
              <Button
                type={'secondary'}
                size={'large'}
                label={t(props.close.label ?? 'cancel')}
                onClick={props.close.action}
              />
            )}
            {props.confirm && (
              <Button
                type={'primary'}
                disabled={props.confirm.disabled}
                size={'large'}
                label={t(props.confirm.label ?? 'confirm')}
                onClick={props.confirm.action}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PopupContent;
