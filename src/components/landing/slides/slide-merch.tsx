import { FC } from 'react'
import Button from 'components/base/button';
import useDeviceDetect from 'hooks/device-detect';
import { Image } from 'react-bootstrap';
import merchop_img from 'assets/images/merchcyop.png'
import LandingSlideSubtitle from '../landing-slide-subtitle';


interface ISlideIntro {
  setSlide: (slide: number) => void
}

const SlideMerch: FC<ISlideIntro> = ({ setSlide }) => {
  const { isTablet } = useDeviceDetect()

  return (
    <div className='row gy-0 py-4 align-items-center'>
      {
        isTablet &&
        <>
          <LandingSlideSubtitle title='DOPE STREETWARE' />
          <br />
          <p className="fw-bold text-white pb-0">
            Merch from Paris with style, exclusively designed by our users for the Cyberpunks:
          </p>
        </>
      }
      <div className='col-12 col-lg-5 order-2 order-lg-1'>
        {
          !isTablet && <>
            <LandingSlideSubtitle title='DOPE STREETWARE' />
            <br />
            <p className="fw-bold text-white">
              Merch from Paris with style, exclusively designed by our users for the Cyberpunks:
            </p>
          </>
        }

        <p>
          This is the Ultra Heavy Cyber Streetware Collection. Timeless - ever expanding - build to wear.
        </p>

        <Button className='mint-btn p-1 px-2'>gear up now</Button>
      </div>
      <div className='col-12 col-lg-7 order-1 order-lg-2'>
        <Image
          className='cyop-nft-image'
          src={merchop_img}
          onClick={() => setSlide(2)}
        />
      </div>
    </div>
  );
};

export default SlideMerch
