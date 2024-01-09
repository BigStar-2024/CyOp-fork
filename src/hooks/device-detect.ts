import { useState, useEffect } from 'react';
import _ from "lodash"

const useDeviceDetect = () => {
	const checkForMobileDevice = () => {
		let windowWidth = window.innerWidth;
		if (windowWidth < 768) {
			return true;
		} else {
			return false;
		}
	};
	const checkForTabletDevice = () => {
		let windowWidth = window.innerWidth;
		if (windowWidth < 1024) {
			return true;
		} else {
			return false;
		}
	};

	const [isMobile, setIsMobile] = useState(checkForMobileDevice());
	const [isTablet, setIsTablet] = useState(checkForTabletDevice());
	const [windowWidth, setWindowWidth] = useState(0)

	useEffect(() => {
		const handlePageResized = _.debounce(() => {
			setIsMobile(checkForMobileDevice);
			setIsTablet(checkForTabletDevice);
			setWindowWidth(window.innerWidth)
		}, 300);

		window.addEventListener('resize', handlePageResized);
		window.addEventListener('orientationchange', handlePageResized);
		window.addEventListener('load', handlePageResized);
		window.addEventListener('reload', handlePageResized);

		return () => {
			window.removeEventListener('resize', handlePageResized);
			window.removeEventListener('orientationchange', handlePageResized);
			window.removeEventListener('load', handlePageResized);
			window.removeEventListener('reload', handlePageResized);
		};
	}, []);

	return {
		isMobile,
		isTablet,
		windowWidth
	};
};

export default useDeviceDetect;