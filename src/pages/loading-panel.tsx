import { FC, useState } from "react"
import useTyped from "hooks/typed";
import ProgressBar from "components/progressbar";
import { useNavigate, useLocation } from "react-router-dom";

export const LoadingPanel: FC = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const redirectLink = location.pathname.replace("/load-data", "");
    const [showProgress, setShowProgress] = useState(false)

    const onCompleteSearchAnimation = () => {
        setShowProgress(true)
    }

    const onCompleteLoading = () => {
        navigate(redirectLink ? redirectLink : "/account/activity");
    }
    const [textInitiate, initiateCompleted] = useTyped({
        text: "initiate terminal...",
        start: true,
        speed: 30,
    })

    const [textLoading] = useTyped({
        text: "loading",
        start: initiateCompleted,
        speed: 30,
        onComplete: onCompleteSearchAnimation
    })

    return (
        <div className="full-screen text-center d-flex flex-column justify-content-center align-items-center disable-select">
            <div className="loading-panel-notification text-start">
                <div className="">
                    <span>{textInitiate}</span>
                    {!initiateCompleted &&
                        <span className="typed-cursor">|</span>
                    }
                </div>
            </div>
            <div className="align-items-center loading-bar">
                <div className="me-1">
                    {textLoading}
                </div>
                <div></div>
                <div style={{ width: "320px" }}>
                    {showProgress &&
                        <ProgressBar progress={100} animateInterval={20} onComplete={onCompleteLoading} />
                    }
                </div>
            </div>
        </div>
    )
}

export default LoadingPanel