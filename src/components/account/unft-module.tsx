import { FC } from "react";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";
import Button from "components/base/button";
import Spinner from 'react-bootstrap/Spinner';

interface UNftModuleProps {
  active: boolean;
  name: string;
  description: string;
  booting: boolean;
  viewImage: (src: string, fullsizeSrc: string) => void;
  imageSrc: string;
  fullsizeImageSrc: string;
  selected: boolean;
  onClick: () => void;
}

export const UnftLoading: FC = () => {
  return (
    <Card bg={"primary"} text="secondary" style={{ border: "none", borderRadius: 0 }} className="text-uppercase">
      <Container className="ms-1" fluid>
        <Row className="no-gutters px-2 py-2" style={{ borderLeft: "solid 3px black" }}>
          <Card.Body style={{ padding: 5 }} className="align-items-start w-100">
            <Spinner animation="border" size="sm" /><p className="fw-bold cyop-nft-title mb-0">Your uNFTs are Loading</p>
            <p className="cyop-nft-desc">
              processing. please be patient while we load your uNFTs into the system.
            </p>
          </Card.Body>
        </Row>
      </Container>
    </Card>
  );
};

export const NoUNft: FC<{ mint: () => void }> = ({ mint }) => {
  return (
    <Card bg={"primary"} text="secondary" style={{ border: "none", borderRadius: 0 }} className="text-uppercase">
      <Container className="ms-1" fluid>
        <Row className="no-gutters px-2 py-2" style={{ borderLeft: "solid 3px black" }}>
          <Card.Body style={{ padding: 5 }} className="align-items-start w-100">
            <p className="fw-bold cyop-nft-title mb-0">no unft detected</p>
            <p className="cyop-nft-desc">
              critical error. it seems like you don't have any unft and therefore no power to unleash:
            </p>
            <Button className="fw-bold pointer cyop-nft-desc" style={{ width: "fit-content" }} onClick={mint}>
              mint yours now
            </Button>
          </Card.Body>
        </Row>
      </Container>
    </Card>
  );
};

export const UNftModule: FC<UNftModuleProps> = ({
  active,
  name,
  description,
  booting,
  viewImage,
  imageSrc,
  fullsizeImageSrc,
  selected,
  onClick
}) => {
  return (
    // <div className='cyop-nft-module'>
    //   <div className={`top-caption ${active && 'active'}`}>
    //     <p className='text-center mb-0'>{active? 'plug out': 'plug in'}</p>
    //   </div>
    //   <img src={unft_mock_img} alt='unft'/>
    //   <div className={`bottom-caption ${active && 'active'}`}>
    //     <p className='text-center mb-0'>{active? 'running': 'activate'}</p>
    //   </div>
    // </div>
    <Card
      bg={"secondary"}
      text="secondary"
      style={{ border: "none", borderRadius: 0, marginTop: 5, cursor: "pointer" }}
      className="text-uppercase"
    >
      <Container fluid className="">
        <Row className="no-gutters">
          <Col xs={6} sm={5} md={4} xxl={3} className="pe-1 ps-0">
            <Image src={imageSrc} className="cyop-nft-image" onClick={() => viewImage(imageSrc, fullsizeImageSrc)} />
          </Col>
          <Col
            xs={6}
            sm={7}
            md={8}
            xxl={9}
            style={{
              backgroundColor: active ? "var(--bs-danger)" : booting ? "var(--bs-disabled)" : "var(--bs-primary)"
            }}
            className="d-flex align-items-center pe-0"
          >
            <Card.Body style={{ padding: 5 }} className="w-100" onClick={() => onClick()}>
              {selected && <p className="fw-bold cyop-nft-title mb-0">SELECTED</p>}
              <p className="fw-bold cyop-nft-title mb-0">{name}</p>
              {selected && (
                <p className="cyop-nft-desc">YOU CAN NOW VOTE IN ORDER TO ACTIVATE THE SELECTED UNFT MODULE</p>
              )}
              {!selected && (
                <>
                  <p className="cyop-nft-desc">{description}</p>
                  <p className="mb-0 cyop-nft-desc">
                    <span className="fw-bold">STATUS: </span>
                    {active ? "plugged in" : booting ? "booting" : "ready"}
                  </p>
                </>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default UNftModule;
