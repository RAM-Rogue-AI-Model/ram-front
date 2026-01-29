import type { HeadingType } from '../interfaces/Heading'
import './Heading.scss'

const Heading = (props:HeadingType) => {

    let className = "Heading"
    if(props.uppercase) className += " uppercase"
    if(props.centered) className += " centered"
    if(props.size) className += " " + props.size
    else className += " xl"

    return (
        props.type === "h2" ? <h2 className={className}>{props.children}</h2>
        : props.type === "h3" ? <h3 className={className}>{props.children}</h3>
        : props.type === "h4" ? <h4 className={className}>{props.children}</h4>
        : props.type === "h5" ? <h5 className={className}>{props.children}</h5>
        : <h1 className={className}>{props.children}</h1>
    )
}

export default Heading