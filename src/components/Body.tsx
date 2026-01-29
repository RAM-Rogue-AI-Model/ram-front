import type { BodyType } from '../interfaces/Body'
import './Body.scss'

const Body = (props:BodyType) => {
    let className = "Body"
    if(props.primary) className += " primary"
    if(props.disabled) className += " disabled"
    if(props.uppercase) className += " uppercase"
    if(props.overflow) className += " overflow"
    if(props.underline) className += " underline"
    if(props.error) className += " error"
    if(props.auto) className += " auto"
    if(props.hoverable) className += " hoverable"
    if(props.hover) className += props.hover === "primary" ? " hoverPrimary" : " hoverSecondary"
    className += (props.size ? " " + props.size : " medium")
    className += (props.weight ? " " + props.weight : " medium")

    return (
        <p className={className} style={props.maxWidth ? {maxWidth : props.maxWidth} : {}}>{props.children}</p>
    )
}

export default Body