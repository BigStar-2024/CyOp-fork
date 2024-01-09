import React, { useState, useEffect } from "react"
import useIncrease from "hooks/increase";
import { formatUnits } from "helpers/utils";
import useDeviceDetect from 'hooks/device-detect';

interface IProgressBarStatus {
    value?: number,
    total?: number,
    unit?: string,
    animateInterval?: number,
    visible?: boolean
    hideValue?: boolean
}

const TOTAL_BAR_COUNT = 20;

export const ProgressBarStatus = ({
    value, total, unit, animateInterval = 3,
    visible = true,
    hideValue,
}: IProgressBarStatus) => {
    const { isMobile, windowWidth } = useDeviceDetect();

    const [progressBars, setProgressBars] = useState<boolean[]>([])
    const currentValue = useIncrease({
        value: ((value || 0) * 100 / (total || 1)),
        speed: animateInterval,
        condition: [value, total]
    })

    useEffect(() => {
        let prog = []
        const progress = Math.ceil(TOTAL_BAR_COUNT * currentValue / 100);
        for (let i = 0; i < TOTAL_BAR_COUNT; i++) {
            prog.push(i < progress)
        }
        setProgressBars(prog)
    }, [currentValue])

    return (
        <div className="co-progress-status d-flex justify-content-end">
            <span>[</span>
            <div className={`${!visible && 'hidden'}`}>

                {progressBars.map((value, index) => (
                    <span className={`${visible ? value ? '' : 'incomplete' : 'hidden'}`} key={`co-progress-status-${index}`}>|</span>
                ))}
            </div>
            {
                !hideValue &&
                <p className={`ms-1 text-desc text-end ${unit === '$' && 'd-flex flex-row-reverse'} m-0`} style={{ width: isMobile ? '5rem' : '6rem' }}><span>{`${formatUnits(value || 0, 0) || '0'}`}</span><span>{unit}</span></p>
            }
            <span>]</span>
        </div>
    )
}

export default ProgressBarStatus