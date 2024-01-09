import React, { useState, useEffect, useRef } from "react"
import useIncrease from "hooks/increase";

interface IProgressBar {
    progress?: number,
    animateInterval?: number,
    onComplete?: () => void
}

const UNIT_PROG_WIDTH = 2;

export const ProgressBar = ({ progress, animateInterval = 5, onComplete }: IProgressBar) => {

    const refProgress = useRef<HTMLDivElement>(null)
    const [progressWidth, setProgressWidth] = useState<number>(0)
    const currentValue = useIncrease({
        value: progress || 0,
        speed: animateInterval,
        condition: [progress],
        onComplete: onComplete
    })

    useEffect(() => {
        if (progress && refProgress.current) {
            const w = refProgress.current.clientWidth
            const currentW = Math.round((w * currentValue / 100) / UNIT_PROG_WIDTH) * UNIT_PROG_WIDTH
            setProgressWidth(currentW)
        }
    }, [currentValue]) // eslint-disable-line

    return (
        <div className="co-progress" ref={refProgress}>
            {progress &&
                <div className="progress-item" style={{ width: `${progressWidth}px` }}></div>
            }
        </div>
    )
}

export default ProgressBar