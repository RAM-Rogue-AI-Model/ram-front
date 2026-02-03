import { useContext, useEffect, useState } from 'react'
import './Game.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { del, get, put } from '../utils/Requests'
import type { DungeonType, GameType } from '../interfaces/Game'
import Loader from '../components/Loader'
import Button from '../components/Button'
import CloseIcon from "./../assets/close.svg"
import HearthIcon from "./../assets/hearth.svg"
import StormIcon from "./../assets/storm.svg"
import SpeedIcon from "./../assets/speed.svg"
import DataIcon from "./../assets/data.svg"
import InventoryIcon from "./../assets/inventory.svg"
import Heading from '../components/Heading'
import type { PlayerType } from '../interfaces/Player'
import Body from '../components/Body'
import { useTranslation } from 'react-i18next'
import PopupContext from '../contexts/PopupContext'
import PopupContent from '../components/PopupContent'
import GameButton from '../components/GameButton'

type StepType = "CHOICE" | "DIALOG" | "DUNGEON"

interface ChoiceType {
    label:string,
    action:()=>void
}

interface LeaveGameType {
    closePopup:()=>void,
    saveGame:()=>void,
    leaveGame:()=>void,
}

const LeaveGamePopup = (props:LeaveGameType) => {
    return (
        <div className="LeaveGamePopup">
            <PopupContent
                title={"game.leave.title"}
                close={{
                    action:props.closePopup,
                    cross:true
                }}
            >
                <div className="LeaveGameContent">
                    <Button
                        label={"game.leave.save"}
                        type={'primary'}
                        size={"large"}
                        full
                        onClick={props.saveGame}
                    />
                    <Button
                        label={"game.leave.no-save"}
                        type={'secondary'}
                        size={"large"}
                        full
                        onClick={props.leaveGame}
                    />
                </div>
            </PopupContent>
        </div>
    )
}

const Game = () => {
    const {t} = useTranslation()
    const [game, setGame] = useState<GameType>()
    const [player, setPlayer] = useState<PlayerType>()
    const [fetchingGame, setFetchingGame] = useState(true)
    const [step, setStep] = useState<StepType | null>(null)
    const [choices, setChoices] = useState<ChoiceType[]>([])
    const [nextDungeon, setNextDungeon] = useState<DungeonType | null>()

    const params = useParams()
    const navigate = useNavigate()

    const {openPopup, closePopup} = useContext(PopupContext)

    const fetchGame = (id:string, playerId:string) => {
        get(`/api/game/${id}?playerId=${playerId}`).then(res => {
            console.log(res)
            if(res){
                const data = res as {game:GameType, player:PlayerType}
                setGame(data.game)
                setPlayer(data.player)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const fetchChoices = (id:string, playerId:string) => {
        get(`/api/game/${id}/choices?playerId=${playerId}`).then(res => {
            if(res){
                const data = res as DungeonType[]
                const choicesTmp:ChoiceType[] = []
                for(const d of data){
                    choicesTmp.push({
                        label:d,
                        action:()=>{setNextDungeon(d)}
                    })
                }
                setChoices(choicesTmp)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const fetchDungeon = () => {

    }

    useEffect(()=>{
        const id = params.id as string
        const playerId = params.playerId as string
        if(id) fetchGame(id, playerId)
    }, [params])

    useEffect(()=>{
        if(game && player) {
            setFetchingGame(false)
            if(game && game.steps){
                if(game.steps.length === 0 || game.steps[game.steps.length - 1].completed) setStep("CHOICE")
                else {
                    console.log("oui")
                    const currentDungeon:DungeonType = game.steps[game.steps.length - 1].type
                    setNextDungeon(currentDungeon)
                }
            }
        }
    }, [game, player, setFetchingGame])

    useEffect(()=>{
        if(game?.id && player?.id){
            switch(step){
                case "CHOICE" :
                    fetchChoices(game.id, player.id)
                    break;
                case "DIALOG" :
                    console.log("Dialog")
                    break;
                case "DUNGEON" :
                    console.log("DUNGEON")
                    break;
                default :
                    break;
            }
        }
    }, [step, game, player])

    useEffect(()=>{
        console.log(choices)
    }, [choices])

    useEffect(()=>{
        if(nextDungeon && game?.id && player?.id && step === "CHOICE"){
            console.log(game)
            if(game.steps && !game.steps[game.steps.length - 1].completed) setStep("DUNGEON")
            else{
                put(`/api/game/${game.id}/dungeon?playerId=${player.id}`, {type:nextDungeon}).then(res => {
                    console.log(res)
                    setStep("DUNGEON")
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    }, [nextDungeon])

    const saveGame = () => {
        navigate('/')
        closePopup()
    }

    const leaveGame = () => {
        if(game?.id && player?.id){
            del(`/api/game/${game.id}?playerId=${player.id}`).then(() => {
                navigate('/')
                closePopup()
            }).catch(err => {
                console.error(err)
            })
        }
    }

    const handleCloseClicked = () => {
        if(game?.id){
            openPopup(<LeaveGamePopup
                closePopup={closePopup}
                saveGame={saveGame}
                leaveGame={leaveGame}
            />, false)
        }
    }

    const renderBattle = () => {
        return (
            <></>
        )
    }

    const renderShop = () => {
        return (
            <></>
        )
    }

    const renderDataCenter = () => {
        return (
            <></>
        )
    }

    const renderDungeon = () => {
        return (
            <></>
        )
    }

    const renderChoice = () => {
        return (
            <div className="GameMap">
                <div className="GameChoices">
                    {
                        choices.map((choice:ChoiceType, idChoice:number)=>(
                            <GameButton key={"choice-c-" + String(idChoice)} label={choice.label} onClick={choice.action} />
                        ))
                    }
                </div>
            </div>
        )
    }

    const renderDialog = () => {
        return (
            <></>
        )
    }

    // IDEE : Faire un tableau de "choix" générique qui change a chaque fois qu'on appuie sur un bouton - la méthode est la même seulement les choix changent

    if(fetchingGame || !player || !game) return <Loader/>
    else{
        return(
            <div className="Game">
                <div className="GameContainer">
                    <div className="GameHeader">
                        <div className="HeaderInfos">
                            <div className="HeaderInfoPart">
                                <Heading size={'m'}>{player.name}</Heading>
                            </div>
                            <div className="HeaderInfoPart">
                                <div className="StatsContent">
                                    <div className="StatImg">
                                        <img src={HearthIcon} alt='Heart'/>
                                    </div>
                                    <div className="StatText">
                                        <Body size={"large"}>{t("game.stat.pv", {current:game.pv, total:player.pv})}</Body>
                                    </div>
                                </div>
                                <div className="StatsContent">
                                    <div className="StatImg">
                                        <img src={StormIcon} alt='Storm'/>
                                    </div>
                                    <div className="StatText">
                                        <Body size={"large"}>{player.attack}</Body>
                                    </div>
                                </div>
                                <div className="StatsContent">
                                    <div className="StatImg">
                                        <img src={SpeedIcon} alt='Speed'/>
                                    </div>
                                    <div className="StatText">
                                        <Body size={"large"}>{player.speed}</Body>
                                    </div>
                                </div>
                                <div className="StatsContent">
                                    <div className="StatImg">
                                        <img src={DataIcon} alt='Data'/>
                                    </div>
                                    <div className="StatText">
                                        <Body size={"large"}>{game.money}</Body>
                                    </div>
                                </div>
                                <div className="StatsContent">
                                    <div className="StatImg">
                                        <img src={InventoryIcon} alt='Inventory'/>
                                    </div>
                                    <div className="StatDetails">
                                        <div className="StatText">
                                            <Body>{t("game.stat.inventory")}</Body>
                                        </div>
                                        {game.consumables?.length === 0 ?
                                            <div className="StatText">
                                                <Body>{t("game.no-items")}</Body>
                                            </div>
                                        : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="CloseButton">
                            <Button
                                type={'nude'}
                                size={'veryLarge'}
                                image={CloseIcon}
                                onClick={handleCloseClicked}
                            />
                        </div>
                    </div>
                    <div className="GameContent">
                        {
                            step === "CHOICE" ? renderChoice()
                            : step === "DIALOG" ? renderDialog()
                            : step === "DUNGEON" ? renderDungeon()
                            : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Game