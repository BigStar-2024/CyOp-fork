import { Fade } from 'react-awesome-reveal'
import CollapseContent from '../collapse-content';
import LandingSlideSubtitle from '../landing-slide-subtitle';


const SlideRoadMap = () => {

  return (
    <>
      <LandingSlideSubtitle title='EXPANSION' />
      <br />
      <Fade
        cascade
        triggerOnce
        damping={0.2}
        duration={200}
      >
        <span className="fw-bold text-white">
          We don’t do roadmaps,
          <span className="text-primary">
            we just deliver
          </span>.
        </span>
        <p />
        <p>
          Below are some of our already reached and upcoming milestones:
        </p><p /><br />

        <CollapseContent
          title={"Launch project website"}
          percent={100}
          content={"Publish of product pitch prior to token launch"}
        />

        <CollapseContent
          title={"Token gen event"}
          percent={100}
          content={"On November 19th 2021, CyOp Protocol stealth launched and liquidity worth $282K got locked"}
        />

        <CollapseContent
          title={"Listing on data aggregators"}
          percent={100}
          content={"Got listed on Coinmarketcap, Coingecko, Delta app, Coinbase et.al within 48hours"}
        />
        <CollapseContent
          title={"Initiation of CyOp I Protocol V1.0.0 alpha"}
          percent={100}
          content={"Protocol deployed and started"}
        />
        <CollapseContent
          title={"Terminal app launch"}
          percent={100}
          content={"Cutting edge DApp alpha successfully booted"}
        />
        <CollapseContent
          title={"Birth of the CyOp Syndicate"}
          percent={100}
          content={"Awakened - united - tuned into the grid. Users can join the community movement and become a #CyOperator by pledging allegiance to the $CyOp Protocol"}
        />
        <CollapseContent
          title={"Burn CyOp worth a million dollar"}
          percent={100}
          content={"In the beginning Devs created a contract and a protocol. And Devs saw their creation, that it was good; Then Devs envisioned disruption and divided the light from the darkness. Devs called the light a pump, and the darkness They called a burn. But the spirit of Devs was still hovering over the chain of events. So, the creation brought forth Punks that yielded Ethereum according to their kind and from the darkness sprung a place without form, the VOID, where all burned token got sucked into the deep. Then Devs blessed and gratified all punks, because in it CyOp worth a MILLION DOLLAR from all their work which Devs had created were BURNED. And Devs saw that it was good!"}
        />
        <CollapseContent
          title={"30M+ mcap"}
          percent={100}
          content={"CyOp reached over 38M mcap for the first time"}
        />
        <CollapseContent
          title={"First CEX listing"}
          percent={100}
          content={"CyOp token tradable from December 4th 2021 on Bitmart exchange, increasing liquidity"}
        />
        <CollapseContent
          title={"CyOp Protocol executed for the first time"}
          percent={100}
          content={"A massive 280 ETH buy-in successfully concluded the first investment round"}
        />
        <CollapseContent
          title={"uNFT premint"}
          percent={100}
          content={"CyOp uNFT Module Limited edition premint"}
        />
        <CollapseContent
          title={"Initiation of CyOp I Protocol Terminal V1.5.0 beta"}
          percent={100}
          content={"Protocol and Terminal updated"}
        />
        <CollapseContent
          title={"Landing Page"}
          percent={100}
          content={"Marketing site redesign as a transport layer for simple interaction with new visitors"}
        />
        <CollapseContent
          title={"Binance application filed"}
          percent={100}
          content={"Successfully filed all listing documents for Binance"}
        />
        <CollapseContent
          title={"Contract Updates in prep for Protocol V2.0.0"}
          percent={100}
          content={"deployed..."}
        />
        <CollapseContent
          title={"uNFT Reveal Iteration 1"}
          percent={100}
          content={"Power and character reveal of the uNFT's in its first Iteration"}
        />
        <CollapseContent
          title={"Crypto fashion novelty"}
          percent={100}
          content={"Dope Community Merchandise by the users for the Cyberpunks"}
        />
        <CollapseContent
          title={"Initiate CyOp Corp"}
          percent={100}
          content={"Through the many the Protocol has evolved and the CyOp CORP manifested itself. This decentralized autonomous corporation (DAC) will become our access point. Infiltration and disruption of the old system from within are our means."}
        />
        <CollapseContent
          title={"Terminal V2.0.0 DApp launch"}
          percent={100}
          content={"Cutting edge DApp aka Terminal successfully booted as the main access point for users to navigate the Protocol."}
        />
        <CollapseContent
          title={"Protocol V2.0.0"}
          percent={100}
          content={"DEVs finalize the next big iteration, fully automated protocol"}
        />
        <CollapseContent
          title={"uNFT public mint"}
          percent={30}
          content={"CyOp uNFT Modules will add an additional layer and enhance the way the DApp-Terminal operates."}
        />
        <CollapseContent
          title={"Protocol V2.1.0"}
          percent={20}
          content={"DEVs finalize more exciting features"}
        />
        <CollapseContent
          title={"Decentralized Autonomous Blockchain (DAB) "}
          percent={10}
          content={"Exploring first of it’s kind Decentralized Autonomous Blockchain (DAB)"}
        />
        <CollapseContent
          title={"MetaGrid"}
          percent={10}
          content={"In search of the next evolutionary phase, an interface between DAC and Metaverse is to be created"}
        />
      </Fade>
    </>
  );
};

export default SlideRoadMap
