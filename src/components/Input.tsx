import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import './Input.scss';
import type { InputType } from '../interfaces/Input';
import Body from './Body';
import SearchIcon from './../assets/search.svg';
import { useTranslation } from 'react-i18next';

const Input = (props: InputType) => {
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const onInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (!props.disabled) {
      const value: string = e.target.value;
      if (props.onChange) props.onChange(value);
    }
  };

  const onTextareaChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!props.disabled) {
      const value = e.target.value;
      if (props.onChange) props.onChange(value);
    }
  };

  const onKeyPress = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.code === 'Enter' && props.onEnterKeyPress) {
      props.onEnterKeyPress();
    }
  };

  return (
    <div className={'InputContainer' + (props.error || error ? ' error' : '')}>
      {props.title && (
        <div className="InputTitle">
          <Body auto error={props.error ? true : false}>
            {t(props.title)}
          </Body>
          {props.essential && (
            <div className="essential">
              <Body size={'large'} primary>
                *
              </Body>
            </div>
          )}
        </div>
      )}
      <div
        className={
          'InputContent' +
          (props.type === 'textarea' ? ' textarea' : '') +
          (props.disabled ? ' disabled' : '') +
          (props.type === 'search' ? ' search' : '')
        }
      >
        {props.type === 'textarea' ? (
          <textarea
            onKeyDown={onKeyPress}
            disabled={props.disabled || undefined}
            className="Input"
            name={props.name}
            autoComplete="on"
            placeholder={props.placeholder ? t(props.placeholder) : undefined}
            maxLength={props.maxLength || undefined}
            value={props.value}
            onChange={onTextareaChanged}
          />
        ) : (
          <input
            onKeyDown={onKeyPress}
            disabled={props.disabled || undefined}
            className="Input"
            name={props.name}
            min={props.min}
            max={props.max}
            autoComplete="on"
            placeholder={props.placeholder ? t(props.placeholder) : undefined}
            type={props.type || 'text'}
            maxLength={props.maxLength || undefined}
            value={props.value}
            onChange={onInputChanged}
          />
        )}
        {props.type === 'search' && (
          <div className="searchIcon">
            <img src={SearchIcon} alt="Search icon" />
          </div>
        )}
      </div>
      {(props.error || error) && (
        <div className="InputLabel">
          <Body auto size={'small'} error>
            {t(props.error || error, { min: props.min, max: props.max })}
          </Body>
        </div>
      )}
    </div>
  );
};

export default Input;
