import { useNavigate, useParams } from 'react-router-dom'
import './Home.scss'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {
    const {t} = useTranslation()

    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        const path = params['*']
        if(path && (path !== "" && path!=="home")) navigate('/')
    }, [params])

    return (
        <div className="Home">
            {t('ram')}
        </div>
    )
}

export default Home