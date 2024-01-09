import AccountStatusPanel from 'pages/layouts/account-status-panel';
import NavPanel from 'pages/layouts/nav-panel';
import { FC, useState } from 'react';
import { useAudio } from "react-awesome-audio";

const sndAction = require('assets/audio/action.mp3').default

interface HumburgerProps {
    open: boolean
    setOpen: () => void
}

const Hamburger: FC<HumburgerProps> = ({ open, setOpen }) => {
    const [path, setPath] = useState('/activity')
    const { play } = useAudio({
        src: sndAction,
    });


    return (
        <div className="cyop-navbar">
            <div className="cyop-nav-container">
                <input
                    className="checkbox"
                    type="checkbox"
                    name="hamburger"
                    id="hamburger-checkbox"
                    checked={open}
                    onChange={() => {
                        play()
                        setOpen()
                    }}
                     />
                <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>
                <div className="menu-items w-100 px-lg-3 px-sm-2 px-0 d-flex flex-column justify-content-between">
                    <NavPanel setPath={setPath} path={path}/>
                    <AccountStatusPanel />
                </div>
            </div>
        </div>
    );
}

export default Hamburger;
