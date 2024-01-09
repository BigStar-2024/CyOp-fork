
import { FC } from "react"
import { AttentionSeeker, Fade } from "react-awesome-reveal"

interface IAddTokenDescription {
    title: string
}

export const AddTokenDescription: FC<IAddTokenDescription> = ({ title }) => {



    return (
        <div>
            <AttentionSeeker effect="headShake">
                <p className="fw-bold">CyOp CORP - Disrupting the world out of cyberspace</p>
                <p className="mb-4">Coming from the future, CyOperations invest, fund and empower.</p>
            </AttentionSeeker>
            <Fade>
                <div className="cyop-border-top cyop-border-bottom py-3 mb-4">
                    <p className="m-0 ps-2">{title}</p>
                </div>
            </Fade>
        </div>
    )
}

export default AddTokenDescription
