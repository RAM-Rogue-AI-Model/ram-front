import { useContext, useEffect, useState } from 'react'
import './Game.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { del, get, patch, post, put } from '../utils/Requests'
import type { Action, ActionsType, BattleExist, BattleType, DungeonType, EffectType, EnemyType, GameStep, GameType } from '../interfaces/Game'
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
import NumberInput from '../components/NumberInput'
import type { ItemType } from '../interfaces/Item'

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

interface AttackPopupType {
    ennemies:EnemyType[],
    onEnemyClicked:(action:Action)=>void,
    closePopup:()=>void
}

const AttackPopup = (props:AttackPopupType) => {

    const onEnemyClicked = (enemy:EnemyType) => {
        if(props.onEnemyClicked) props.onEnemyClicked({
            type:"attack",
            target_id:enemy.id
        }) 
    }

    return (
        <div className="ActionPopup">
            <PopupContent
                title={"battle.attack.title"}
                close={{
                    action:props.closePopup,
                    cross:true
                }}
            >
                <div className="ActionPopupContent">
                    {props.ennemies && props.ennemies.length > 0 && props.ennemies.map((enemy:EnemyType, idEnemy:number) => (
                        <GameButton key={"key-enemy-choice-" + idEnemy} label={enemy.name} onClick={()=>{onEnemyClicked(enemy)}} />
                    ))}
                </div>
            </PopupContent>
        </div>
    )
}

interface ItemPopupType {
    items:ItemType[],
    onItemClicked:(action:Action)=>void,
    closePopup:()=>void,
    playerId:string
}

const ItemsPopup = (props:ItemPopupType) => {
    const {t} = useTranslation()

    const onItemClicked = (item:ItemType) => {
        if(props.onItemClicked) props.onItemClicked({
            type:"item",
            target_id:props.playerId,
            item_id:item.id
        }) 
    }

    return (
        <div className="ActionPopup">
            <PopupContent
                title={"battle.items.title"}
                close={{
                    action:props.closePopup,
                    cross:true
                }}
            >
                <div className="ActionPopupContent">
                    {props.items && props.items.length > 0 ? props.items.map((item:ItemType, idItem:number) => (
                        <GameButton key={"key-item-choice-" + idItem} label={item.name} onClick={()=>{onItemClicked(item)}} />
                    ))
                    :
                        <div className="ItemsEmpty">
                            <Body>{t("game.inventory.empty")}</Body>
                        </div>
                    }
                </div>
            </PopupContent>
        </div>
    )
}


interface ViewInventoryType {
    closePopup:()=>void,
    inventory:ItemType[]
}

const ViewInventory = (props:ViewInventoryType) => {
    const {t} = useTranslation()

    return (
        <div className="ViewInventoryPopup">
            <PopupContent
                title={"shop.inventory.title"}
                close={{
                    action:props.closePopup,
                    cross:true
                }}
            >
                <div className="ViewInventoryContent">
                    {props.inventory.map((item:ItemType, itemId:number) => (
                        <div key={'popup-inventory-'+ itemId} className="ViewInventoryCase">
                            <Body>{t("shop.inventory.item", {name:item.name, description:item.description})}</Body>
                        </div>
                    ))}
                </div>
            </PopupContent>
        </div>
    )
}

const RecapContent = (props:{steps:GameStep[]}) => {
    return (
        <div className="RecapContent">
            {props.steps.map((step:GameStep, stepId:number) => (
                <div className={"RecapStep" + (step.completed? " completed" : "")} key={'step-' + stepId}>
                    <Body>{stepId + 1}</Body>
                    <div className="divider"></div>
                    <Body>{step.type}</Body>
                </div>
            ))}
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
    const [battle, setBattle] = useState<BattleType | null>()
    const [shop, setShop] = useState<ItemType[] | null>()
    // const [battle, setBattle] = useState<BattleType | null>()
    const [pv, setPV] = useState<number>(0);
    const [atk, setATK] = useState<number>(0);
    const [spe, setSPE] = useState<number>(0);
    const [itemsUsed, setItemsUsed] = useState<string[]>([])

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
            navigate('/')
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

    const createDungeon = (gameId:string, playerId:string) => {
        post(`/api/battle/`, {game_id:gameId, player_id:playerId}).then(res => {
            const data = res as BattleType
            setBattle(data)
        }).catch(err => {
            console.error(err)
        })
    }

    const fetchDungeon = (gameId:string, playerId:string) => {
        switch(nextDungeon){
            case "DUNGEON":
                get(`/api/battle/game/${gameId}`).then(res => {
                    if(res){
                        const data = res as BattleExist
                        if(data.exist){
                            setBattle(data as BattleType)
                        }else {
                            createDungeon(gameId, playerId)
                        }
                    }
                }).catch((err) => {
                    console.error(err)
                })
                break;
            case "DATACENTER":
                
                break;
            case "SHOP":
                get(`/api/shop/${gameId}?playerId=${playerId}`).then(res => {
                    if(res){
                        const data = res as ItemType[]
                        setShop(data)
                    }
                })
                break;
            default :
                break;
        }
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
                if(game.steps.length === 0 || game.steps[game.steps.length - 1]?.completed) setStep("CHOICE")
                else {
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
                    console.log("Dungeon")
                    fetchDungeon(game.id, player.id)
                    break;
                default :
                    break;
            }
        }
    }, [step, game, player])

    useEffect(()=>{
        if(nextDungeon && game?.id && player?.id && step !== "DUNGEON"){
            if(game.steps && game.steps.length > 0 && !game.steps[game.steps.length - 1].completed) setStep("DUNGEON")
            else{
                put(`/api/game/${game.id}/dungeon?playerId=${player.id}`, {type:nextDungeon}).then(res => {
                    const data = res as GameStep
                    const gameTmp = {...game}
                    if(!gameTmp.steps) gameTmp.steps = []
                    gameTmp.steps.push(data)
                    setGame(gameTmp)
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

    const leaveGame = (popup = true) => {
        if(game?.id && player?.id){
            del(`/api/game/${game.id}?playerId=${player.id}&force=true`).then(() => {
                navigate('/')
                if(popup) closePopup()
            }).catch(err => {
                console.error(err)
            })
        }
    }

    const EndGame = (gameId:string, playerId:string) => {
        del(`/api/game/${gameId}?playerId=${playerId}&pv=${pv}&attack=${atk}&speed=${spe}`).then(() => {
            navigate('/')
        }).catch(err => {
            console.error(err)
        })
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

    const completeDungeon = (gameId : string, playerId:string, itemId?:string) => {
        patch(`/api/game/${gameId}`, {player_id:playerId, item_id:itemId}).then(res => {
            if(battle) setBattle(null)
            if(res){
                const data = res as GameType
                setGame(data)
                if(itemsUsed && itemsUsed.length > 0) setItemsUsed([])
                setNextDungeon(null)
                setStep('CHOICE')
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const battleAction = (battleId:string, action:Action) => {
        post(`/api/battle/${battleId}/action`, {...action}).then(res => {
            if(res){
                if(action.type === "item" && action.item_id){
                    const itemsTmp:string[] = [...itemsUsed]
                    itemsTmp.push(action.item_id)
                    setItemsUsed(itemsTmp)
                }
                const data = res as BattleType
                setBattle(data)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const handleAttackClicked = (battleId:string, enemies: EnemyType[]) => {
        if(enemies && enemies.length > 0){
            openPopup(<AttackPopup ennemies={enemies} closePopup={closePopup} onEnemyClicked={(action:Action) => {closePopup();battleAction(battleId ,action)}}/>, false)
        }
    }

    const getItems = (items:ItemType[]) => {
        const itemsTmp:ItemType[] = [...items]
        for(const itemId of itemsUsed){
            const usedItem = itemsTmp.find(i => i.id === itemId)
            if(usedItem) itemsTmp.splice(itemsTmp.indexOf(usedItem), 1)
        }
        return itemsTmp 
    }

    const handleItemsClicked = (playerId: string, battleId: string, items:ItemType[]) => {
        openPopup(<ItemsPopup playerId={playerId} onItemClicked={(action:Action)=>{closePopup();battleAction(battleId, action)}} closePopup={closePopup} items={getItems(items)} />, false)
    }

    const handleInventoryClick = (inventory:ItemType[]) => {
        openPopup(<ViewInventory closePopup={closePopup} inventory={inventory}/>, false)
    }

    const getFighterName = (fighterId : string) => {
        if(!battle || !player) return
        if(fighterId === "player") return player.name + ' (joueur)'
        else {
            const id = fighterId.includes('enemy_') ? fighterId.split("_")[1] : fighterId
            
            const currentEnemy = battle.enemy.find(e => e.id === id)
            if(currentEnemy) return currentEnemy.name
            else if(player.id === id) return player.name
            else return fighterId
        }
    }

    const renderBattle = () => {
        if(!game?.id || !game.steps || !player?.id || !battle) return <Loader/>

        return (
            <div className="GameMap">
                <Heading size={"s"}>{t('battle.title')}</Heading>
                {battle.winner ? 
                    battle.winner === "player" ? 
                    <div className="BattleContainer">
                        <Body>{t("battle.win.title")}</Body>
                        <Body>{t("battle.win.gain", {count:20 * (1 + Math.floor(game.steps.length / 10))})}</Body>
                        <GameButton label='battle.win.action' onClick={()=>completeDungeon(game.id, player.id)} />
                    </div>
                    : <div className="BattleContainer">
                        <Body>{t("battle.defeate.title")}</Body>
                        {/* <GameButton label='battle.win.action' onClick={()=>completeDungeon(game.id, player.id)} /> */}
                        {game.steps && game.steps.length > 0 && <div className="BattleContent">
                            <Heading size={"xs"}>{t("game.recap.title")}</Heading>
                            <RecapContent steps={game.steps}/>
                        </div>}
                        <div className="BattleContent">
                            <Body>{t("battle.defeate.level", {level:game.steps ? game.steps.length-1 : 0})}</Body>
                        </div>
                        {game.steps && game.steps.length > 1 && <div className="BattleContent">
                            <Heading size={"xs"}>{t("battle.defeate.gain")}</Heading>
                            <Body weight={'bold'}>
                            {t('home.creation.stats.title', {
                                points: game.steps.length-1 - (pv + atk + spe),
                            })}
                            </Body>
                            <div className="BattleInputs">
                                <NumberInput
                                    name={'pv'}
                                    title={'home.creation.stats.health.title'}
                                    min={0}
                                    max={game.steps.length-1 - (atk + spe)}
                                    value={pv}
                                    disabled={game.steps.length-1 === 0}
                                    onChange={(nbr: number) => setPV(nbr)}
                                />
                                <NumberInput
                                    name={'atk'}
                                    title={'home.creation.stats.attack.title'}
                                    min={0}
                                    disabled={game.steps.length-1 === 0}
                                    max={game.steps.length-1 - (pv + spe)}
                                    value={atk}
                                    onChange={(nbr: number) => setATK(nbr)}
                                />
                                <NumberInput
                                    name={'vit'}
                                    title={'home.creation.stats.speed.title'}
                                    min={0}
                                    disabled={game.steps.length-1 === 0}
                                    max={game.steps.length-1 - (atk + pv)}
                                    value={spe}
                                    onChange={(nbr: number) => setSPE(nbr)}
                                />
                            </div>
                        </div>}
                        <div className="BattleContent">
                            <Button disabled={game.steps && (game.steps.length-1 - (pv + atk + spe) !== 0)} size={"large"} label={"battle.defeate.action"} onClick={()=>EndGame(game.id, player.id)}/>
                        </div>
                    </div>
                :<div className="BattleContainer">
                    <div className="BattleContent">
                        <Body>{t("battle.turn.title", {count:Object.keys(battle.actions).length + 1})}</Body>
                    </div>
                    <div className="BattleContent">
                        <Body>{t("battle.enemy.title")}</Body>
                        <div className="BattleWrap">
                            {battle.enemy && battle.enemy.length > 0 && battle.enemy.map((enemy:EnemyType, idEnemy) => (
                                <div className="EnemyCase" key={"enemy-"+idEnemy}>
                                    <Body>{enemy.name}</Body>
                                    <div className="StatContent">
                                        <div className="StatImg">
                                            <img src={HearthIcon} alt='Heart'/>
                                        </div>
                                        <div className="StatText">
                                            <Body size={"large"}>{enemy.pv}</Body>
                                        </div>
                                    </div>
                                    <div className="StatContent">
                                        <div className="StatImg">
                                            <img src={StormIcon} alt='Storm'/>
                                        </div>
                                        <div className="StatText">
                                            <Body size={"large"}>{enemy.attack}</Body>
                                        </div>
                                    </div>
                                    <div className="StatContent">
                                        <div className="StatImg">
                                            <img src={SpeedIcon} alt='Speed'/>
                                        </div>
                                        <div className="StatText">
                                            <Body size={"large"}>{enemy.speed}</Body>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="BattleContent">
                        <Body>{t("battle.actions.title")}</Body>
                        <div className="GameChoices">
                            <GameButton label={t("battle.actions.attack")} onClick={()=>{handleAttackClicked(battle.id, battle.enemy)}} />
                            <GameButton label={t("battle.actions.defend")} onClick={()=>{battleAction(battle.id, {type:"defend", target_id:"player"})}} />
                            <GameButton label={t("battle.actions.item")} disabled={!game.consumables || game.consumables.length === 0} onClick={()=>{handleItemsClicked(player.id, battle.id, game.consumables ?? [])}} />
                        </div>
                    </div>
                    {battle.effect && battle.effect.length > 0 && <div className="BattleContent">
                        <Body>{t("battle.effects.title")}</Body>
                        <div className="BattleWrap">
                            {battle.effect.map((effect:EffectType, id:number) => (
                                <div key={"effect-" + id} className="EffectCard">
                                    <Body>{t("battle.effects.effect." + effect.stat_name, {count:effect.count, modificator:effect.modificator, turn:effect.duration})}</Body>
                                </div>
                            ))}
                        </div>
                    </div>}
                    <div className="BattleContent">
                        <Body>{t("battle.history.title")}</Body>
                        <div className="HistoryContainer">
                            <div className="HistoryHeader">
                                <div className="HistoryCase fix">
                                    <Body>{t("battle.history.table.header.n")}</Body>
                                </div>
                                <div className="HistoryCase">
                                    <Body>{t("battle.history.table.header.actions")}</Body>
                                </div>
                            </div>
                            <div className="HistoryDivider"/>
                            <div className="HistoryContent">
                                {Object.keys(battle.actions).length > 0 ? 
                                    Object.values(battle.actions).reverse().map((actions: ActionsType, actionId:number) => (
                                        <div className="HistoryRow" key={"turn-" + (actionId+1)}>
                                            <div className="HistoryCase fix"><Body>{Object.values(battle.actions).length - actionId}</Body></div>
                                            <div className="HistoryCase col">
                                                {Object.keys(actions).map((fighter:string, idFighter:number) => (
                                                    <div className="HistoryDetails" key={"turn-" + actionId + "-fighter-" + idFighter}>
                                                        <Body>{t("battle.history.table.actions."+actions[fighter].type, {name:getFighterName(fighter), name1:getFighterName(fighter), name2:getFighterName(actions[fighter].target_id)})}</Body>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                : <div className="HistoryEmpty">
                                    <Body>{t("battle.history.table.empty")}</Body>
                                </div> }
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }

    const renderShop = () => {
        if(!shop || shop.length === 0 || !game?.id || !player?.id) return <Loader/>

        return (
            <div className="GameMap">
                <Heading size={"s"}>{t('shop.title')}</Heading>
                <div className="GameChoices">
                    <Body>{t("shop.description")}</Body>
                    {shop.map((item:ItemType, id:number) => (
                        <GameButton key={"item-" + id} label={t("shop.items.item", {name:item.name, description:item.description, price:item.price})} onClick={()=>{completeDungeon(game.id, player.id, item.id)}} />
                    ))}
                    <GameButton label='shop.items.none' onClick={()=>{completeDungeon(game.id, player.id)}} />
                </div>
            </div>
        )
    }

    const renderDataCenter = () => {
        return (
            <div className="GameMap">

            </div>
        )
    }

    const renderDungeon = () => {
        if(nextDungeon === "DATACENTER") return renderDataCenter()
        else if(nextDungeon === "SHOP") return renderShop()
        else return renderBattle()
    }

    const renderChoice = () => {
        return (
            <div className="GameMap">
                <div className="GameMapContainer">
                    <Heading size={"xs"}>{t("game.choices.title")}</Heading>

                    <div className="GameChoices">
                        {
                            choices.map((choice:ChoiceType, idChoice:number)=>(
                                <GameButton key={"choice-c-" + String(idChoice)} label={choice.label} onClick={choice.action} />
                            ))
                        }
                    </div>
                </div>
                {game?.steps && game.steps.length > 0 &&  <div className="RecapContainer">
                    <Heading size={"xs"}>{t("game.recap.title")}</Heading>
                    <RecapContent steps={game.steps}/>
                </div>}
            </div>
        )
    }

    const renderDialog = () => {
        return (
            <></>
        )
    }

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
                                        <Body size={"large"}>{t("game.stat.pv", {current:battle ? battle.pv : game.pv, total:player.pv})}</Body>
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
                                        : <div className="InventoryContent">
                                            <Body>{t("game.inventory.count", {count:game.consumables?.length ?? 0})}</Body>
                                            <Button size={"auto"} type={'secondary'} label={'game.inventory.see'} onClick={()=>handleInventoryClick(game.consumables ?? [])} />
                                        </div> }
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