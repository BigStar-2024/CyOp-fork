import Button from "components/base/button";
import { FC, memo } from "react";
import { Fade } from "react-awesome-reveal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { IReward } from "shared/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { decimals } from "shared/constants";
import { BigNumber } from "ethers";

interface IAccountClaimPanel {
  claim: () => any;
  rewards: Array<IReward>;
  rewardsReady: boolean;
  totalReward: BigNumber | string;
}

export const AccountClaimPanel: FC<IAccountClaimPanel> = ({ claim, rewards, rewardsReady, totalReward }) => {
  return (
    <div className="co-top-panel cyop-border-top cyop-border-bottom-lg-up">
      <Fade triggerOnce>
        <Container className="align-items-center" fluid>
          <Row className="align-items-center">
            <Col md={8} sm={12} className="d-flex justify-content-between px-0">
              <p className="text-start align-middle m-2 color-danger">Your claimable rewards:</p>
              <p className="text-start align-middle m-2 color-danger mx-sm-0">{`${formatUnits(
                totalReward,
                decimals.USDC
              )} USDC`}</p>
            </Col>
            <Col md={4} sm={12}>
              <Button
                disabled={!rewardsReady || !rewards || rewards.length === 0 || BigNumber.from(totalReward).lte(0)}
                variant="contained"
                className="py-1"
                onClick={claim}
                fullWidth
              >
                claim {rewardsReady ? "" : <Spinner animation="border" size="sm" />}
              </Button>
            </Col>
          </Row>
        </Container>
      </Fade>
    </div>
  );
};

export default memo(AccountClaimPanel);
