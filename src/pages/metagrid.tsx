import { useEffect, useState, VFC } from "react"
import useTyped from "hooks/typed"
import { useAudio } from "react-awesome-audio"

const sndContent = require("assets/audio/content.mp3").default

export const Metagrid: VFC<{ setPath: (path: string) => void }> = ({ setPath }) => {

	const [blinking, setBlinking] = useState(false)
	const [blinkText, setBlinkText] = useState('')

	const { play } = useAudio({
		src: sndContent,
	})

	useEffect(() => {
		play()
		setPath("/metagrid");
	}, []) // eslint-disable-line

	useEffect(() => {
		if (blinking)
			setBlinkText("failed to load resource")
		else
			setBlinkText('')
	}, [blinking])

	const onCompleteTyping = () => {
		setInterval(function () {
			setBlinking(blinking => !blinking)
		}, 500)
	}

	const [textInstalling, installingCompleted] = useTyped({
		text: "installing...",
		start: true,
		speed: 30,
		startDelay: 2000,
		endDelay: 1000,
	})

	const [textAdd, connectCompleted] = useTyped({
		text: "add parameter",
		start: installingCompleted,
		speed: 30,
		startDelay: 500,
		endDelay: 1000,
	})

	const [textFailed, failedCompleted] = useTyped({
		text: "failed to load resource",
		start: connectCompleted,
		speed: 30,
		startDelay: 500,
		onComplete: onCompleteTyping
	})

	return (
		<div className="co-metagrid">
			<div className="metagrid-pattern text-center justify-content-center align-items-center">
			</div>

			<div className="metagrid-text text-center justify-content-center align-items-center" >
				<span id="blinking" className="text-danger align-middle">{blinkText}</span>
				<div>
					{!installingCompleted &&
						<span>{textInstalling}</span>
					}
				</div>
				<div>
					{installingCompleted && !connectCompleted &&
						<span>{textAdd}</span>
					}
				</div>
				<div>
					{connectCompleted && !failedCompleted &&
						<span className="text-danger">{textFailed}</span>
					}
				</div>
			</div>
		</div>
	)
}

export default Metagrid