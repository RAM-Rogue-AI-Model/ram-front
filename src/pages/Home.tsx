import { useNavigate, useParams } from 'react-router-dom'
import './Home.scss'
import { useEffect } from 'react'
import Button from '../components/Button'

const Home = () => {
    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        const path = params['*']
        if(path && (path !== "" && path!=="home")) navigate('/')
    }, [params, navigate])

    return (
        <div className="Home">
            <Button label={"login.title"} type={'secondary'} onClick={()=>navigate('/login')}/>
        </div>
    )
}

export default Home