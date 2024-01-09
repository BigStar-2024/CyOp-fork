import useTyped from "hooks/typed"
import { useRef } from "react"
import { useAudio } from 'react-awesome-audio'

const sndContent = require('assets/audio/content.mp3').default;
const sndCmd = require('assets/audio/command.mp3').default;

export const ClickCommand = ({
  inputCommand,
  setInputCommand,
  setIsClkCmd,
  clickCommand,
  setClkCmdFinish,
  clkCmdContent,
  setInitClick
}: any) => {

	const inputRef = useRef(null)

  const { play } = useAudio({
    src: sndContent,
  });
  const { play: playCmd } = useAudio({
    src: sndCmd,
  });

  const onTitleCompleted = () => {
		setIsClkCmd(true)

    if(clickCommand === 'clear') setInputCommand([''])
    else {
      let tempCmd = inputCommand.concat(
          <div><div>CyOp:\Terminal&gt;{clickCommand}</div><p/><div className="text-desc">{clkCmdContent['loading']}</div><p/></div>);
      playCmd();
      setInputCommand(tempCmd);

      setTimeout(() => {
        play();
        let tempCmd = inputCommand.concat(
          <div><div>CyOp:\Terminal&gt;{clickCommand}</div><p/><div className="text-desc">{clkCmdContent['loading']}</div><p/><div>{clkCmdContent['description']}</div><br /></div>);
        setInputCommand(tempCmd);
      }, 300);
    }

    setInitClick(false)
		setIsClkCmd(false)
		setClkCmdFinish(true)
  }

	const [title, titleCompleted] = useTyped({
		text: clickCommand,
		start: true,
		speed: 30,
    onComplete: onTitleCompleted,
	})

	return (
		<div ref={inputRef}>
			<div>
				<div>CyOp:\Terminal&gt;
				<span>{title}</span>
				{!titleCompleted &&
					<span className="typed-cursor danger">|</span>
				}
        </div>
			</div>
		</div>
	)
}

export default ClickCommand