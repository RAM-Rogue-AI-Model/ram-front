export interface ButtonType {
    label?:string | null,
    icon?:string | null,
    onClick:() => void,
    size?:"medium"|"large"|"small"|null,
    type?:"primary"|"secondary"|"link"|null
}