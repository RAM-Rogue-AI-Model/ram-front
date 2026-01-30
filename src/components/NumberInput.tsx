import { useEffect, useState } from 'react';
import type { NumberInputType } from '../interfaces/Input';
import './NumberInput.scss';
import Input from './Input';
import ArrowTop from './../assets/arrowTop.svg';
import ArrowBottom from './../assets/arrowBottom.svg';
import Body from './Body';
import { useTranslation } from 'react-i18next';

const NumberInput = (props: NumberInputType) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(String(props.value));

  useEffect(() => {
    const numberValue = Number(value);
    if (typeof numberValue === 'number' && Number.isFinite(numberValue)) {
      if (
        (props.min == null || (props.min && numberValue >= props.min)) &&
        (props.max == null || (props.max && numberValue < props.max))
      ) {
        props.onChange(numberValue);
      }
    }
  }, [value]);

  useEffect(() => {
    setValue(String(props.value));
  }, [props.value]);

  const handlePlus = () => {
    if (!props.max || props.value + 1 <= props.max) {
      props.onChange(props.value + 1);
    }
  };

  const handleMinus = () => {
    if (!props.min || props.value - 1 >= props.min) {
      props.onChange(props.value - 1);
    }
  };

  return (
    <div className="NumberInput">
      {props.title && (
        <div className="NumberInputTitle">
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
      <div className="NumberInputContainer">
        <Input
          {...props}
          title={undefined}
          type={'number'}
          value={value}
          error={value === '' ? 'input-error' : ''}
          onChange={(str: string) => setValue(str)}
        />
        <div className="NumberInputOptions">
          <button className="NumberInputOption" onClick={handlePlus}>
            <img src={ArrowTop} alt="Arrow top" />
          </button>
          <button className="NumberInputOption" onClick={handleMinus}>
            <img src={ArrowBottom} alt="Arrow bottom" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
