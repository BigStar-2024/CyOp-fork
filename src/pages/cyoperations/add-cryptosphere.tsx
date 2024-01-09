import { useState, useEffect, FC } from "react";
import { useNavigate } from 'react-router-dom';
import useTyped from "hooks/typed";
import { useAudio } from "react-awesome-audio";
import { useWeb3 } from "shared/hooks";
import addresses from "shared/addresses";
import TextInputing from "components/text-input";
import AddTokenDescription from "components/cyoperations/add-token-description";
import { toast } from "react-toastify";
import {
  isValidContractAddress,
  isValidDescription,
  isValidDetailedDescription,
  isValidTokenName,
  isValidWebsite,
  isValidYoutubeLink,
  extractYoutubeId
} from "helpers/utils";
import { createCyoperation } from "shared/backend";

const sndAction = require("assets/audio/action.mp3").default;

interface AddCryptosphereProps {
  setPath: any
}

export const AddCryptosphere: FC<AddCryptosphereProps> = ({setPath}) => {
  const { chainId, switchNetwork, signMessage } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (chainId !== addresses.networkID) {
      switchNetwork(addresses.networkID);
    }
  }, [chainId, switchNetwork]);

  useEffect(() => {
    if (setPath) {
      setPath("/cyoperations");
    }
  }, []);

  const maxTickerLen = 35;
  const maxDescriptionLen = 100;
  const maxFullDescriptionLen = 1500;
  const [tokenName, setTokenName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [pairAddress, setPairAddress] = useState("");
  const [tickerRejectionReason, setTickerRejectionReason] = useState("");
  const [youtubeRejectionReason, setYoutubeRejectionReason] = useState("");
  const [descriptionRejectionReason, setDescriptionRejectionReason] = useState("");
  const [fullDescriptionRejectionReason, setFullDescriptionRejectionReason] = useState("");
  const [websiteRejectionReason, setWebsiteRejectionReason] = useState("");
  const [pairRejectionReason, setPairRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const { play } = useAudio({
    src: sndAction
  });

  const [tokenTickerLabel] = useTyped({
    text: "Enter token ticker",
    start: true,
    speed: 30
  });

  const [youtubeLabel] = useTyped({
    text: "Enter youtube video link",
    start: true,
    speed: 30
  });

  const [descriptionLabel] = useTyped({
    text: "Enter short description [up to 100 characters]",
    start: true,
    speed: 30
  });

  const [detailedDescriptionLabel] = useTyped({
    text: "Enter full description [up to 1500 characters]",
    start: true,
    speed: 30
  });

  const [websiteLabel] = useTyped({
    text: "Enter website",
    start: true,
    speed: 30
  });

  const [pairLabel] = useTyped({
    text: "Enter pair address",
    start: true,
    speed: 30
  });

  const propsValid = () => {
    const validations = [
      {
        value: tokenName,
        func: isValidTokenName,
        setRejectionReason: setTickerRejectionReason,
        maxLen: maxTickerLen
      },
      { value: youtubeLink, func: isValidYoutubeLink, setRejectionReason: setYoutubeRejectionReason },
      {
        value: description,
        func: isValidDescription,
        setRejectionReason: setDescriptionRejectionReason,
        maxLen: maxDescriptionLen
      },
      {
        value: detailedDescription,
        func: isValidDetailedDescription,
        setRejectionReason: setFullDescriptionRejectionReason,
        maxLen: maxFullDescriptionLen
      },
      { value: website, func: isValidWebsite, setRejectionReason: setWebsiteRejectionReason },
      { value: pairAddress, func: isValidContractAddress, setRejectionReason: setPairRejectionReason }
    ];

    let allPropsValid = true;

    for (let validation of validations) {
      let isValid, validationError;

      if ("maxLen" in validation) {
        ({ isValid, validationError } = validation.func(validation.value, validation.maxLen!));
      } else {
        ({ isValid, validationError } = validation.func(validation.value));
      }

      validation.setRejectionReason(isValid ? "" : validationError);
      allPropsValid = allPropsValid && isValid;
    }
    return allPropsValid;
  };

  const onClickSubmit = () => {
    const tryCreateCyoperation = async () => {
      try {
        setProcessing(true);
        if (!propsValid() || !signMessage) {
          setProcessing(false);
          return;
        }
        const signature = await signMessage({action: "create cyoperation"});
        if (!signature) return;
        let processedDetailedDescription = detailedDescription.replace(/\n\s*\n\s*\n/g, "\n\n");
        const res = await createCyoperation(signature, {
          type: "cryptosphere",
          name: tokenName,
          description: description,
          link: website,
          address: pairAddress,
          youtubeId: extractYoutubeId(youtubeLink),
          detailedDescription: processedDetailedDescription
        });
        if (res.status === 200) {
          toast.success("Cyoperation has been successfully created!");
          navigate("/cyoperations/" + res.data._id);
        } else {
          toast.error(res.statusText);
        }
        setProcessing(false);
      } catch (e: any) {
        setProcessing(false);
        toast.error(e.response?.data ? e.response.data : e.message);
      }
    };
    play();
    tryCreateCyoperation();
  };

  return (
    <div className="co-left-panel">
      <AddTokenDescription title="Cryptosphere_file_creation" />
      <div className="ps-2 pe-1" id="input-form">
        <div id="token-ticker-input" className="mb-2 text-inputting">
          <span>
            {tokenTickerLabel} ({maxTickerLen - tokenName.length} characters left){" "}
            {tickerRejectionReason.length > 0 && <span style={{ color: "#FF00A0" }}>[{tickerRejectionReason}]</span>}
          </span>
          <TextInputing
            setValue={setTokenName}
            validation={isValidTokenName}
            setRejectionReason={setTickerRejectionReason}
            focused={true}
            maxLen={maxTickerLen}
          />
        </div>

        <div id="youtube-link-input" className="mb-2 text-inputting">
          <span>
            {youtubeLabel}{" "}
            {youtubeRejectionReason.length > 0 && <span style={{ color: "#FF00A0" }}>[{youtubeRejectionReason}]</span>}
          </span>
          <TextInputing
            setValue={setYoutubeLink}
            validation={isValidYoutubeLink}
            setRejectionReason={setYoutubeRejectionReason}
          />
        </div>

        <div id="description-input" className="mb-2 text-inputting">
          <span>
            {descriptionLabel} ({maxDescriptionLen - description.length} characters left){" "}
            {descriptionRejectionReason.length > 0 && (
              <span style={{ color: "#FF00A0" }}>[{descriptionRejectionReason}]</span>
            )}
          </span>
          <TextInputing
            setValue={setDescription}
            validation={isValidDescription}
            setRejectionReason={setDescriptionRejectionReason}
            maxLen={maxDescriptionLen}
          />
        </div>

        <div id="detailed-description-input" className="mb-2 text-inputting">
          <span>
            {detailedDescriptionLabel} ({maxFullDescriptionLen - detailedDescription.length} characters left){" "}
            {fullDescriptionRejectionReason.length > 0 && (
              <span style={{ color: "#FF00A0" }}>[{fullDescriptionRejectionReason}]</span>
            )}
          </span>
          <TextInputing
            setValue={setDetailedDescription}
            validation={isValidDetailedDescription}
            setRejectionReason={setFullDescriptionRejectionReason}
            maxLen={maxFullDescriptionLen}
            allowParapraphs={true}
          />
        </div>

        <div id="website-input" className="mb-2">
          <span>
            {websiteLabel}{" "}
            {websiteRejectionReason.length > 0 && <span style={{ color: "#FF00A0" }}>[{websiteRejectionReason}]</span>}
          </span>
          <TextInputing
            setValue={setWebsite}
            validation={isValidWebsite}
            setRejectionReason={setWebsiteRejectionReason}
          />
        </div>

        <div id="pair-input" className="mb-2">
          <span>
            {pairLabel}{" "}
            {pairRejectionReason.length > 0 && <span style={{ color: "#FF00A0" }}>[{pairRejectionReason}]</span>}
          </span>
          <TextInputing
            setValue={setPairAddress}
            validation={isValidContractAddress}
            setRejectionReason={setPairRejectionReason}
          />
        </div>

        {processing && (
          <div className="button-label opacity-50">
            <i className="fa fa-repeat fa-spin" aria-hidden="true" style={{ fontSize: "15px" }} />
            &nbsp;processing
          </div>
        )}

        {!processing && (
          <div className="d-flex flex-row">
            <div className="button-label" style={{ width: "100px" }} onClick={onClickSubmit}>
              submit
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCryptosphere;
