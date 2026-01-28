import './Login.scss'

interface LoginType {
    login : (
        token : string,
        userId : string,
        username : string
    ) => void,
    tab:string
}

const Login = (props:LoginType) => {

    return (
        <div className="Login">
            {'tab ! '}
        </div>
    )
}

export default Login