import { useState, useEffect, useRef, VFC } from "react";
import CollapseContent from "./collapse-content";

interface ILandingContentInferior {
  setIsVid: (active: boolean) => void
}

const LandingContentInferior: VFC<ILandingContentInferior> = ({ setIsVid }) => {
  const [lastPos, setLastPos] = useState(0);
  const [tsPos, setTSPos] = useState(null);
  const [tePos, setTEPos] = useState(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const progressCircleRef = useRef<HTMLDivElement | null>(null)

  const scrollHandle = () => {
    if (innerRef.current && progressCircleRef.current && progressBarRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = innerRef.current;

      setLastPos(scrollTop);

      let scrollPercent = scrollTop / (scrollHeight - clientHeight) * 100;
      progressBarRef.current.style.height = scrollPercent + '%'

      // progress circle hide

      if (scrollTop + clientHeight === scrollHeight || scrollTop <= 0) {
        progressCircleRef.current.style.display = "none";
      } else {
        progressCircleRef.current.style.display = "block";
      }

      // mouse direction change
      const wheelUpIcon = document.getElementById('wheel-up')
      const wheelDownIcon = document.getElementById('wheel-down')

      if (wheelUpIcon && wheelDownIcon) {
        if (scrollTop + clientHeight > scrollHeight - 100) {
          wheelUpIcon.style.display = "block";
          wheelDownIcon.style.display = "none";
        } else {
          wheelUpIcon.style.display = "none";
          wheelDownIcon.style.display = "block";
        }
      }
    }
  }

  const wheelHandle = (e: any) => {
    let y = e.deltaY;
    if (y < 0 && lastPos === 0)
      setIsVid(true);
  }

  const tsHandle = (e: any) => {
    setTEPos(null);
    setTSPos(e.targetTouches[0].clientY);
  }

  const tmHandle = (e: any) => {
    setTEPos(e.targetTouches[0].clientY);
  }

  const teHandle = (e: any) => {
    if (!tsPos || !tePos) return;

    if (tePos > tsPos + 50 && lastPos <= 0)
      setIsVid(true);
  }

  useEffect(() => {
    let height = window.screen.height;

    if (height < 420 && innerRef.current) {
      innerRef.current.style.marginTop = '110px'
      innerRef.current.style.height = "calc(100vh - 220px)"
      // innerRef.current.style.marginTop = "110px";
    }
  }, []);

  return (
    <div className="landing-content-txt text-left" ref={innerRef} onScroll={scrollHandle} onWheel={(e) => wheelHandle(e)} onTouchStart={(e) => tsHandle(e)} onTouchMove={(e) => tmHandle(e)} onTouchEnd={(e) => teHandle(e)}>
      <div className="landing-slideUp">

        {/* INTRO */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>COMING FROM THE FUTURE</span><p />

          <span className="fw-bold text-white">The CyOp Corp is a unique place where Cyberpunks can <span className="text-primary">invest, empower and fund in disruptive ways</span>.</span><p />

          <p>At the heart of the Corporation lies the protocol, which gets executed by a sophisticated mechanism that fully deploys the power of blockchain to hack the existing system.</p><p />

          <p>Get your first $CyOp now to become part of the revolution.</p>
        </div>
        <br /><br />
        <br /><br />

        {/* ELI5 */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>HOW THE PROTOCOL OPERATES</span><p />

          <span className="fw-bold text-white">A 10% tax is collected on every $CyOp and uNFT transaction.</span><p />

          <p>Users can submit CyOperations to vote on during a cycle.</p><p />
          <p>Each time a cycle gets completed the protocol will be executed using the funds to:</p><p />

          ■ Invest in, fund and empower disruptive CyOperations<br />
          ■ Distribute rewards in $usdc to users<br />
          <p>■ Buy back and burn $CyOp to generate a deflationary overload</p><p /><br />

          Want to learn more?<br />
          <p><a href="https://cyop.io/" target="_blank" rel="noreferrer">Tune into the grid and read about the inner workings of the CyOp CORP</a></p><p />
        </div>
        <br /><br />
        <br /><br />

        {/* uNFT */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>uNFT MODULE LIMITED EDITION </span><p />

          <span className="fw-bold text-white">Augment your experience with the very first utility NFTs in the cryptosphere.</span><p />

          <p>1,000 units only, rare by nature, unique in style with powers to influence the protocol in a gamified manner.</p><p />
          <p>Owners earn $usdc rewards and can start CyOperations.</p><p />
        </div>
        <br /><br />
        <br /><br />

        {/* Merchandise */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>DOPEST STREETWARE </span><p />

          <span className="fw-bold text-white">Merch from Paris with style, exclusively designed by our users for the Cyberpunks:</span><p />

          <p>This is the Ultra Heavy Cyber Streetwear 2022 Collection.</p><p />
        </div>
        <br /><br />
        <br /><br />

        {/* TOKENOMICS */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>CYOPNOMICS</span><p />

          <span className="fw-bold text-white">The native token is <span className="text-primary">$CyOp</span>. Members can use $CyOp to participate within the Protocol and earn $usdc rewards.</span><p />

          95,80B<br />
          <p style={{ opacity: "0.5" }}>Total supply | all in circulation | deflationary</p><p />

          10%<br />
          <p style={{ opacity: "0.5" }}>Tax</p><p />

          <span style={{ wordBreak: "break-word" }}>0xddac9c604ba6bc4acec0fbb485b83f390ecf2f31</span><br />
          <p style={{ opacity: "0.5" }}>Contract: (ERC20)</p>
        </div>
        <br /><br />
        <br /><br />

        {/* ROADMAP */}
        <div>
          <span className="text-title"><span className="text-primary">{'//'} </span>EXPANSION</span><p />

          <span className="fw-bold text-white">We don’t do roadmaps, <span className="text-primary">we just deliver</span>.</span><p />
          <p>Below are some of our already reached and upcoming milestones:</p><p /><br />

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
            content={"CyOp uNFT Modules will add an additional layer of utility unheard of in crypto and enhance the way the DApp-Terminal operates"}
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
            title={"Binance application accepted"}
            percent={100}
            content={"Successfully filed all listing documents for Binance"}
          />
          <CollapseContent
            title={"Contract Updates in prep for Protocol V2.0.0"}
            percent={100}
            content={"Changes will increase the amount of rewards claimable by all Users"}
          />
          <CollapseContent
            title={"uNFT Reveal"}
            percent={100}
            content={"Character class and power reveal"}
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
            content={"CyOp uNFT Modules will add an additional layer of utility unheard of in crypto and enhance the way the DApp-Terminal operates."}
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
            title={"Metagrid"}
            percent={10}
            content={"In search of the next evolutionary phase, an interface between DAC and Metaverse is to be created"}
          />
        </div>
        <br />

        <p className="text-primary">{'//'} to be continued</p>
      </div>

      <div className="progress-line d-flex flex-column align-items-center">
        <div ref={progressBarRef} className="progress-bar" id="progress-bar"></div>
        <div ref={progressCircleRef} className="progress-circle border border-primary" id="progress-circle"></div>
      </div>
    </div>
  );
};

export default LandingContentInferior;
