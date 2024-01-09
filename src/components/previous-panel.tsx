import { useState, useEffect, ReactNode } from "react"
import { useAudio } from "react-awesome-audio";
import useContracts from 'shared/hooks/useContracts'
import TreeNode from "components/base/tree-node";
import useTyped from "hooks/typed";
const sndContent = require("assets/audio/content.mp3").default

interface IEventNode {
    text: ReactNode,
    children?: IEventNode[]
}

const activeEvents: IEventNode[] = [
    {
        text: <><span>X2Y2:\</span><span className="ms-1 text-desc">41.18% votes\disrupted&#62;</span></>,
        children: [
            {
                text: <><span>99,739 X2Y2 bought for 13.6 eth </span><span className="text-danger"></span></>,
                children: [
                    {
                        text: <><span>0 X2Y2 burned in the void </span><span className="text-danger"></span></>
                    },
                    {
                        text: <><span>99,739 X2Y2 sleeping in the void </span><span className="text-danger"></span></>
                    }
                ]
            }
        ]
    },
    {
        text: <><span>1.7 eth transfered to lucky user </span><span className="text-danger"></span></>,
    },
    {
        text: <><span>0.85 eth and 131,055,142,653 CyOp added to CyOp liquidity </span><span className="text-danger"></span></>
    }
]

export const PreviousPanel = () => {

    const [textInitDate, isinitdatetextCompleted] = useTyped({
        text: "Initiated: 2022-05-01",
        start: true,
        speed: 30
    })
    const [textExeDate, isexedatetextCompleted] = useTyped({
        text: "Executed: 2022-06-16",
        start: isinitdatetextCompleted,
        speed: 30
    })

    const { play } = useAudio({
        src: sndContent,
    });

    const { round, getProposalWon } = useContracts()

    const [events, setEvents] = useState<IEventNode[]>([])

    let loadTimer: NodeJS.Timeout | null = null;
    const [isBellowTextVisible, setBellowTextVisible] = useState(false)

    const addEvent = (idx: number) => {
        let humanize = idx === 0 ? Math.round(Math.random() * 800 + 3500) : Math.round(Math.random() * 300 + 100);
        loadTimer = setTimeout(() => {
            if (idx < activeEvents.length) {
                const newEvents = activeEvents.slice(0, idx + 1)
                setEvents(newEvents)
                if (idx < 2)
                    play();
            } else {
                setBellowTextVisible(true);
            }
            addEvent(idx + 1)
        }, humanize)
    }

    const getProposalDetails = () => {
        if (round && getProposalWon) {
            round().then((_round) => {
                if (_round) {
                    getProposalWon(_round).then((proposal) => {
                        console.log("getProposalWon:", proposal)
                    })
                }
            })
        }
    }

    useEffect(() => {
        getProposalDetails()
        addEvent(0)
        return () => {
            if (loadTimer)
                clearTimeout(loadTimer)
        }
    }, []) // eslint-disable-line

    return (
        <div className="co-left-panel">
            <div className="text-desc">
                <span>{textInitDate}</span>
                {!isinitdatetextCompleted &&
                    <span className="typed-cursor danger">|</span>
                }
            </div>
            <div className="mb-2">
                <span>{textExeDate}</span>
                {isinitdatetextCompleted && !isexedatetextCompleted &&
                    <span className="typed-cursor danger">|</span>
                }
            </div>
            {isexedatetextCompleted &&
                <div className="co-main-content py-3 flex-1">
                    <div className="co-treeview">
                        {events.map((event, idx) => (
                            <TreeNode key={`rootnode-${idx}`} title={event.text} defaultExpanded={idx === 0}>
                                {event.children?.map((chi_event, chi_idx) => (
                                    <TreeNode key={`child-${idx}-${chi_idx}`} title={chi_event.text} defaultExpanded={idx === 0}>
                                        {chi_event.children?.map((node, node_idx) => (
                                            <TreeNode key={`innerchild-${idx}-${chi_idx}-${node_idx}`} title={node.text} />
                                        ))}
                                    </TreeNode>
                                ))}
                            </TreeNode>
                        ))}
                    </div>
                    {isBellowTextVisible &&
                        <div className="text-desc pt-5">27.00% CyOp -|- second place<br />&nbsp;&nbsp;&nbsp;&nbsp;18.54% NTVRK -|- third place</div>
                    }
                </div>
            }
        </div>
    )
}

export default PreviousPanel
