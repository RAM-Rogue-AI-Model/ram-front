import { useTranslation } from 'react-i18next'
import Body from './Body'
import './GameButton.scss'

interface GameButtonType {
    label:string,
    onClick:()=>void,
    disabled?:boolean | null
}

const GameButton = (props:GameButtonType) => {
    const {t} = useTranslation()

    const onButtonClicked = () => {
        if(!props.disabled) props.onClick()
    }

    if(!props.label || !props.onClick) return 

    return (
        <button className={"GameButton" + (props.disabled ? " disabled" : "")} onClick={onButtonClicked} disabled={props.disabled ?? undefined}>
            <div className="GameButtonLabel">
                <Body>{t(props.label)}</Body>
            </div>
        </button>
    )
}

export default GameButton