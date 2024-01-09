import { FC } from 'react'
import Button from 'components/base/button';
import useDeviceDetect from 'hooks/device-detect';
import { Fade } from 'react-awesome-reveal'
import { Image } from 'react-bootstrap';
import unft_mock_img from 'assets/images/unftmodule.png'
import LandingSlideSubtitle from '../landing-slide-subtitle';


interface ISlideIntro {
  setSlide: (slide: number) => void
}

const SlideUNft: FC<ISlideIntro> = ({ setSlide }) => {
  const { isTablet } = useDeviceDetect()

  return (
    <div className='row gy-0 py-4 align-items-center'>
      {
        isTablet && <>
          <LandingSlideSubtitle title='uNFT MODULE LIMITED EDITION' />
          <br />

          <p className="fw-bold text-white">
            Augment your experience with the very first utility NFTs in the cryptosphere.
          </p>
        </>
      }
      <div className='col-12 col-lg-5'>
        <Image
          className='cyop-nft-image'
          src={unft_mock_img}
          onClick={() => setSlide(1)}
        />
      </div>
      <div className='col-12 col-lg-7'>
        {
          !isTablet && <>
            <Fade
              cascade
              triggerOnce
              damping={0.1}
              duration={300}
            >
              <LandingSlideSubtitle title='uNFT MODULE LIMITED EDITION' />
              <br />

              <p className="fw-bold text-white">
                Augment your experience with the very first utility NFTs in the cryptosphere.
              </p>
            </Fade>
          </>
        }
        <p>
          1,000 units only, rare by nature, unique in style with powers to influence the protocol in a gamified manner.
        </p>

        <p>
          Owners can start new CyOperations and earn $USDC rewards. MetaGrid citizenship included.
        </p>
        <Button className='mint-btn p-1 px-2'>Mint now</Button>
      </div>
    </div>
  );
};

export default SlideUNft
