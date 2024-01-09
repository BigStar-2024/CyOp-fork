
import { FC, useEffect, useState } from "react"
import useTyped from "hooks/typed"
import Button from "components/base/button"
import { toast } from "react-toastify"
import AddTokenSelect from "../../components/cyoperations/add-token-select"
import AddTokenDescription from "components/cyoperations/add-token-description"
import { useAudio } from "react-awesome-audio"
import { useContracts } from "shared/hooks"
const sndContent = require('assets/audio/content.mp3').default;

interface AddTargetProps {
    setPath: any
}

export const AddTarget: FC<AddTargetProps> = ({setPath}) => {
    const { balanceOfUNFT } = useContracts();
    const [hasUNft, setHasUNft] = useState(false);
    const { play } = useAudio({
        src: sndContent,
    });

    const [noUnft, noUnftCompleted] = useTyped({
        text: "Only uNFT holders are eligible to create a new CyOp.",
        start: true,
        speed: 10
    })

    useEffect(() => {
        if (setPath) {
            setPath("/cyoperations");
        }

        const fetchUNftBalance = async () => {
            try {
                if (!balanceOfUNFT) {
                    setHasUNft(false);
                    return;
                }
                const unftBalance = await balanceOfUNFT();
                if (unftBalance == null) {
                    setHasUNft(false);
                    return;
                }
                setHasUNft(unftBalance.gt(0));
            } catch (e) {
                setHasUNft(false);
            }
        };
        fetchUNftBalance();
    }, []);

    useEffect(() => {
        if (hasUNft) {
            play()
        }
    }, [hasUNft])
    return (
        <div className="co-left-panel">
            {
                hasUNft ?
                    <div>
                        <AddTokenDescription title='Select_disruption_target' />
                        <div>
                            <AddTokenSelect />
                        </div>
                    </div> :
                    <>
                        <div className="mb-2">
                            <span>{noUnft}</span>
                        </div>
                        {
                            noUnftCompleted &&
                            <Button
                                variant="text"
                                className="fw-bold"
                                onClick={() => {
                                    setHasUNft(true)
                                    toast.success('NFT is minted!')
                                }}>Mint your uNFT now.</Button>
                        }
                    </>
            }
        </div>
    )
}

export default AddTarget