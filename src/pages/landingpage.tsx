import { useState } from 'react'
import LandingLogo from "components/landing/landing-logo"
import LandingNav from "components/landing/landing-nav"
import LandingFooter from "components/landing/landing-footer"
import FsLightbox from 'fslightbox-react'
import LandingMainContent from 'components/landing/landing-main-content'
import LandingContentSlides from 'components/landing/landing-content-slides'

const youtubuSources = [
	'https://www.youtube.com/watch?v=YyEkGg-I6p0', // landing movie
	'https://www.youtube.com/watch?v=NOllZEz8qSs', // unft
	'https://www.youtube.com/watch?v=XO0TL2fvtV4',	// merch
]

export const LandingPage = () => {
	const [toggler, setToggler] = useState(false)
	const [slide, setSlide] = useState(0)
	const [isVid, setIsVid] = useState(true)

	const openLightBox = (slide: number) => {
		setSlide(slide)
		setToggler(!toggler)
	}

	return (
		<div className="full-screen d-flex flex-column align-items-center px-3">
			<LandingLogo />
			<LandingNav />
			{isVid ?
				<LandingMainContent setSlide={openLightBox} setIsVid={setIsVid} /> :
				<LandingContentSlides setSlide={openLightBox} setIsVid={setIsVid} />
			}
			<LandingFooter />
			<FsLightbox
				toggler={toggler}
				sources={youtubuSources}
				sourceIndex={slide}
			/>
		</div>
	)
}

export default LandingPage
