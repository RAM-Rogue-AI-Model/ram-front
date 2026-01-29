export interface InputType {
    title?:string | null,
    value?:string | number,
    onChange: (str:any) => void,
    type?: "search" | "textarea" | "number" | "password" | "text" | "email" | null,
    maxLength?:number | null,
    name:string,
    autocomplete?:string|null,
    onEnterKeyPress?:()=>void|null,
    disabled?:boolean|null,
    placeholder?:string|null,
    error?:string | null,
    min?:number | string,
    max?:number | string,
    essential?:boolean|null
}