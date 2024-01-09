import React, { ForwardRefRenderFunction, forwardRef, ReactNode, CSSProperties } from 'react';
import { useAudio } from "react-awesome-audio";

const sndAction = require('assets/audio/action.mp3').default

export interface ButtonProps {
    className?: string,
    onClick?: () => void,
    disabled?: boolean,
    style?: CSSProperties
    children?: ReactNode | undefined,
    icon?: any // image src for button icon
    variant?: 'text' | 'contained'
    fullWidth?: boolean
    reverse?: boolean // switch button icon position: true ? icon is end : icon is start
}

const Button: ForwardRefRenderFunction<HTMLDivElement, ButtonProps> = ({
    className = '',
    disabled = false,
    onClick,
    style,
    children,
    icon,
    variant,
    reverse,
    fullWidth
}, ref) => {

    const { play } = useAudio({
        src: sndAction,
    });

    return (
        <div
            ref={ref}

            className={`align-items-center justify-content-center gap-1 co-button ${reverse ? 'flex-row-reverse' : ''} ${className} ${disabled ? "disabled" : ''} ${variant ?? ''} `}
            onClick={(e) => {
                if (disabled) return;
                play()
                if (onClick) {
                    setTimeout(() => {
                        onClick()
                    }, 300)
                }
            }}
            style={{
                ...(fullWidth ? { display: 'flex' } : { width: 'fit-content' }),
                ...style,
                height: 'fit-content'
            }}
        >
            {icon && <img src={icon} style={{ height: '1em', width: 'auto' }} alt='wallet-icon' />}
            {children}
        </div >
    );
}

export default forwardRef(Button);
