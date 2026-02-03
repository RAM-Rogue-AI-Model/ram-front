import Body from './Body'
import './GameButton.scss'

interface GameButtonType {
    label:string,
    onClick:()=>void,
    disabled?:boolean | null
}

const GameButton = (props:GameButtonType) => {

    const onButtonClicked = () => {
        if(!props.disabled) props.onClick()
    }

    if(!props.label || !props.onClick) return 

    return (
        <button className={"GameButton"} onClick={onButtonClicked} disabled={props.disabled ?? undefined}>
            <Body>{props.label}</Body>
        </button>
    )
}

export default GameButton