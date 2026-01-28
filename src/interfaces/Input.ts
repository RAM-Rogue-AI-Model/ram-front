export interface InputType{
    type?:"search"|"text"|"textarea"|null,
    value:string,
    onChange:(str:string)=>void,
    title?:string,
    placeholder?:string
}