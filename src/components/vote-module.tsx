import { FC } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";

interface VoteModuleProps {
  name: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export const VoteModule: FC<VoteModuleProps> = ({ name, description, selected, onClick }) => {
  return (
    <Card
      bg={"secondary"}
      text="secondary"
      style={{ border: "none", borderRadius: 0, marginTop: 5, cursor: "pointer" }}
      className="text-uppercase"
    >
      <Container fluid className="">
        <Row className="no-gutters">
          <Col xs={6} sm={5} md={4} xxl={3} className="pe-1 ps-0" />
          <Col
            xs={6}
            sm={7}
            md={8}
            xxl={9}
            style={{
              backgroundColor: "var(--bs-primary)"
            }}
            className="d-flex align-items-center pe-0"
          >
            <Card.Body style={{ padding: 5 }} className="w-100" onClick={() => onClick()}>
              {selected && <p className="fw-bold cyop-nft-title mb-0">SELECTED</p>}
              <p className="fw-bold cyop-nft-title mb-0">{name}</p>
              <p className="cyop-nft-desc">{description}</p>
              <p className="mb-0 cyop-nft-desc"></p>
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default VoteModule;
