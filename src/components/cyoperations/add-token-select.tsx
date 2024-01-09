
import { FC } from "react"
import Button from "components/base/button"
import { investTypes } from "mockup"
import { useNavigate } from "react-router-dom"
import { Slide } from "react-awesome-reveal"


export const AddTokenSelect: FC = () => {
    const navigate = useNavigate();


    const handleInvestTypeClick = (item: any) => {
        navigate(item.id)
    }


    return (
        <div className="cyop-invest-types">
            <ul>
                {
                    investTypes.map((type: any) => (
                        <Slide cascade duration={1000} direction='down' key={type.id}>
                            <div className="pb-3">
                                <li ><Button variant="text" onClick={() => handleInvestTypeClick(type)}>{type.title}</Button></li>
                                <span className="text-desc">
                                    {type.description}
                                </span>
                            </div>
                        </Slide>
                    ))
                }
            </ul>
        </div>
    )
}

export default AddTokenSelect