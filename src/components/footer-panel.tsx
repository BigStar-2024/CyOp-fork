import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import YouTube from 'react-youtube'
import Button from './base/button'

interface videoResponse {
	id: string
}

export const Footer = () => {

	const [isPlaying, setPlaying] = useState(false)
	const navigate = useNavigate()

	const videoRef = useRef<any>()

	const [item, setItem] = useState<videoResponse>(Object)

	const possibleVideos = [
		{ id: 'Z6dIdJX4ens' },
		{ id: 'vlEN8svyHj8' },
		{ id: 'kNh-Nyt1ywU' },
		{ id: 'Nja0Obgg2gU' },
		{ id: 'Wy_6jN1Yrx8' },
		{ id: 'MV_3Dpw-BRY' },
		{ id: 'ZV9qvauLlmo' },
		{ id: 'Lfrn1oGdB6o' },
		{ id: 'XMEXPkPmmq0' },
		{ id: 'V5RSYSaM8Uc' },
		{ id: 'uXXo1YDA9tE' },
		{ id: '8GW6sLrK40k' }
	]

	useEffect(() => {
		let cur_item =
			possibleVideos[Math.floor(Math.random() * possibleVideos.length)]

		setItem(cur_item)
	}, []) // eslint-disable-line

	const onClickMusic = () => {
		// play/pause sound of the video
		isPlaying
			? videoRef.current.internalPlayer.pauseVideo()
			: videoRef.current.internalPlayer.playVideo()

		setPlaying(isPlaying => !isPlaying)
	}

	return (
		<div className="d-flex flex-row">
			<div className="flex-1 co-footer-panel disable-select">V 2.0.0</div>
			<div className="co-music-panel pointer disable-select d-flex gap-1">
				<Button variant='text' style={{color:'black'}} onClick={() => navigate('/alert/unft')}>Alert/nft</Button>
				<Button variant='text' style={{color:'black'}} onClick={() => navigate('/alert/vote')}>Alert/vote</Button>
				<span>music</span>
				{isPlaying &&
					<div className="fw-900" onClick={onClickMusic}>∣|∣∣|||∣∣∣||∣∣∣|||∣∣|∣</div>
				}
				{!isPlaying &&
					<div className="fw-900" onClick={onClickMusic}>∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣∣</div>
				}
			</div>

			<YouTube
				ref={videoRef}
				videoId={item.id ? item.id : ''}
				opts={{
					height: '0',
					width: '0',
					playerVars: {
						autoplay: 0
					}
				}}
			/>
		</div>
	)
}

export default Footer
