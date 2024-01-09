import useDeviceDetect from "hooks/device-detect";
import { useState, useRef, useEffect } from "react";
import { useAudio } from "react-awesome-audio";
import useContracts from "shared/hooks/useContracts";
const sndContent = require("assets/audio/document.mp3").default;

export const CommandInputV2 = ({ setLoadingCommand, setInputCommand, setDocumentNumber, values }: any) => {
  const { currentCycle } = useContracts();
  const inputRef = useRef<null | HTMLInputElement>(null);
  const commandRef = useRef<null | HTMLElement>(null);

  const { isMobile, windowWidth } = useDeviceDetect();
  const [totalHoldings, setTotalHoldings] = useState(0);
  const [command, setCommand] = useState<any>("");
  const onClickCommand = (cmd: string) => {
    handleCommand(cmd);
  };

  const { play: playDocument } = useAudio({
    src: sndContent,
    loop: false
  });
  const CommandListItem = ({ command }: { command: string }) => {
    return (
      <p className="command-click mb-0" onClick={() => onClickCommand(command)}>
        {command}
      </p>
    );
  };
  const COMMAND_LIST: Array<any> = [
    {
      command: "intro",
      documentNumber: "PQ FZZ41004",
      relatedCommands: ["protocol", "corp", "help"],
      description: (
        <div>
          Back to the roots of crypto.
          <br />
          <br />
          Coming from the future, CyOperations invest, fund and empower.<p></p>
          The community behind this unique endeavor consists of courageous cyberpunks committed to the highest ideals
          and dedicated to financial justice. Allowing mankind to fuel the breakaway society and build a better system
          by disrupting the outdated.
          <br />
          <br />
          CyOp is the red line… it’s the turning point… this is revolution.
        </div>
      )
    },
    {
      command: "protocol",
      documentNumber: "FT LSR31107",
      relatedCommands: ["cycle", "rewards", "void", "burn", "help"],
      description: (
        <div>
          At the heart of the Corporation lies the protocol in its latest iteration, which gets executed by a sophisticated mechanism that fully utilizes the power of the blockchain to hack the system and change the world of DeFi.<p></p>
          The transparent, encoded rules create this one of a kind decentralized autonomous corporation (DAC).<p></p>
          True decentralization comes down to users having total control over their funds — at all times. Connecting to the terminal and interacting with the protocol requires no staking and no commitments. Your Crypto stays untouched — in your own wallet, as a fundamental element. All funds are always secure and there is no use of middlemen — this is what truly sets CyOp apart from a typical DAO.
          <br />
          <br />
          This is how it operates▌<p></p>
          The Protocol incorporates a treasury that’s filled through various streams. 
          <br />
          Users submit CyOperations to vote on during a cycle.
          <br />
          <p>Each time a cycle gets completed the protocol will be executed to:</p>
          <p />
          ■ Invest, fund and empower
          <br />
          ■ Reward cyberpunks in $USDC
          <br />
          <p>■ Buy and burn $CyOp to generate a deflationary overload</p>
          <p />
          <br />
          <p>Want to learn more?</p>
          <p>
            <a href="https://cyop.gitbook.io/thegrid/" target="_blank" rel="noreferrer">
              Tune into the grid and read about the inner workings of the CyOp CORP
            </a>
          </p>
          <p />
        </div>
      )
    },
    {
      command: "corp",
      relatedCommands: ["protocol", "syndicate", "help"],
      documentNumber: "EV ILZ33111",
      description: (
        <div>
          I told you revolution was coming. So I handed the CyOp Protocol to you. Now we are many…<p></p>
          We have observed the level of degeneration society has produced. We have acted by using all the knowledge to
          create a tool that is available to all.<p></p>
          Through the many the Protocol has evolved and the CyOp CORP manifested itself. This corporation will become
          our access point.<p></p>
          Infiltration and disruption of the old system from within are our means. A positive form of anarchy for the
          independence of all users is the aim!<p></p>
          We didn’t come here to tell you how this is going to end. We came here to tell you how it begins.<p></p>
        </div>
      )
    },
    {
      command: "terminal",
      relatedCommands: ["cyoperations", "cycle", "protocol", "help"],
      documentNumber: "TK UI96543",
      description: (
        <div>
          The user interface is a terminal that lets you access the features of the DAC through a DApp experience. With its beautiful design and regular updates, it pays homage to all the Cyberpunks out there, hacking the existing system to unleash a better one. By connecting your wallet to the Terminal, it automatically assigns an account to it.<p></p>
        </div>
      )
    },
    {
      documentNumber: "MG HOLONX03",
      relatedCommands: ["unft", "help"],
      command: "metagrid",
      description: 
        <div>
          A digital libertarian cyberpunk city and the central hub of the corporation. An ecosystem generating various new ways to feed the protocol.<p></p>
          
          This city provides cyberspace for all innovative and disruptive CyOperations. $CyOp will be the central currency within, running on its own DAB (decentralized autonomous blockchain) and powering the MetaGrid.<p></p>
          One day, it might push its boundaries out of cyberspace and into the real world with a physical MetaGrid iteration.<p></p>
        </div>
    },
    {
      command: "recharge",
      relatedCommands: ["tax", "protocol", "help"],
      documentNumber: "RM NFT00391",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="">
              The fund acts as a hedge, making the protocol highly resilient to different market phases.<p></p>
              Every time a token from the holding fund gets sold 12.5% of the generated revenue will be sent to the recharge fund.<p></p>
              The more often that happens, the stronger the CORP becomes. Independent of other protocol partitions, it will be able to recharge itself autonomously for years.</p>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>currently locked</span>
              <span className="text-danger text-end">${values.recharge}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "rewards",
      relatedCommands: ["cycle", "void", "unft", "help"],
      documentNumber: "RW KKL837110",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="">
              $USDC rewards are distributed after each cycle using 20% of the whole Reward fund. As a result, the fund will continue to grow, as will the amount of rewards that can be earned.<p></p>
              You’re eligible to receive rewards if you participated in the previous cycle and your respective $CyOp and uNFT balance stayed equal or higher. The more you hold, the bigger your share.<p></p>
              …and this is where it gets crazy, there is a glitch within the original source code: “The Matrix Glitch“ — randomly rewarding a single lucky userr</p>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>rewards paid out</span>
              <span className="text-danger text-end">${values.totalRewards}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "unft",
      relatedCommands: ["cycle", "protocol", "rewards", "help"],
      documentNumber: "BR REP55819",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="mb-0">
              The CyOp protocol has been designed in a modular way. Various NFT-based extensions allow users to connect to the Protocol and influence the voting process in a gamified manner.<p></p>
              With a supply of only 1,000 they are very rare by nature and add an additional layer of utility — enhancing the way you use the Terminal.<p></p>
              Owners can start new CyOperations and earn $USDC rewards. MetaGrid citizenship included.</p>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>rewards paid out</span>
              <span className="text-danger text-end">${values.totalUnftRewards}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "cycle",
      relatedCommands: ["tax", "protocol", "rewards", "help"],
      documentNumber: "L5 ZQG77291",
      description: (
        <div>
          A Cycle is a measurement of time used within the Protocol. One cycle equals one week on earth.<p></p>
          At the beginning of each cycle, the system verifies the $CyOp token balance for each user.<p></p>
          Based on this calculation, a user will receive voting rights in accordance with the tokens held and will be able to use owned uNFT powers.<p></p>
          Each time a cycle gets completed the protocol will be executed and 3 CyOperations with the most votes will win.
        </div>
      )
    },
    {
      command: "tax",
      relatedCommands: ["treasury", "protocol", "burn", "help"],
      documentNumber: "HK XDAW4413",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="mb-0">
              A Tax is collected throughout a cycle. The tax, currently at 10%, is diminishing and gets lower with increasing ecosystem adoption and higher trading volume until hitting 1%.<p></p>
              The distribution is as follows:<p></p>
            </p>
          </div>
          <div className="command-links cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <li>
              CyOperations <span className="text-desc"> 40%</span>
            </li>
            <li>
              Reward fund <span className="text-desc"> 20%</span>
            </li>
            <li>
              $CyOp buy & burn <span className="text-desc"> 10%</span>
            </li>
            <li>
              Next cycle <span className="text-desc"> 10%</span>
            </li>
            <li>
              Growth hacking <span className="text-desc"> 20%</span>
            </li>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>total</span>
              <span className="text-danger text-end">10%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "burn",
      relatedCommands: ["tax", "void", "help"],
      documentNumber: "PJ VMT98660",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            Cyclical $CyOp buyback and burn is fed through the 1% tax. If a holding gets sold, 12.5% of the revenue will fuel additional burns.<p></p>
            With all existing $CyOp already in circulation the well thought out tokenomics are deflationary in nature, transferring value from jeets to true cyberpunks.<p></p>
            The effect even gets amplified as every time $CyOp would trade in red the quantity of $CyOp that will be burned potentially increases and the amount of time and capital needed to climb back up to new heights will be reduced.
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>buybacks</span>
              <span className="text-desc text-end">{currentCycle ? currentCycle.toString() : 0}</span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>burned supply</span>
              <span className="text-danger text-end">
                {values.burntPercent}% ($ {values.totalBurned})
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "void",
      relatedCommands: ["protocol", "rewards", "burn", "help"],
      documentNumber: "VD XXXXXXX",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="mb-0">
              CyOp is defined by more than the value of its token. Prices are volatile, but underlying assets are the real Gamechanger. CyOp CORP’s holdings are steadily increasing through cyclical purchases of various erc20 tokens. They feed a fund designed for permanent growth — the so-called Void.<p></p>
              Accumulated tokens from this holding fund (aka Void) are sold strategically. The revenue flows back into different protocol partitions directly profiting all users through passive income.
            </p>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>total value locked</span>
              <span className="text-danger text-end">${totalHoldings}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "cyoperations",
      relatedCommands: ["terminal", "cycle", "protocol", "help"],
      documentNumber: "CY OPS13500",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <p className="mb-0">
              A CyOperation (short CyOp) is a unique and disruptive community governed event, triggered by the CyOp Protocol.
              <br />
              <br />
              Use the Terminal to upload a CyOperation to the system. This requires a key in form of a uNFT module. A CyOperation can later be voted on by other DAC users to invest, fund and empower fresh thinking and new solutions to hack the system.
              <br />
              <br />
              There are different types of disruption targets to choose for a CyOperation:<p></p>■ Cryptosphere
              (invest):<p></p>
              Select any erc20 based project to invest in. It represents a way to invest in smart blockchain based
              applications that improve the system or even shitcoins with massive upside that could later fill the fund
              and thus benefit the protocol and all active participants in rewards or in the aforementioned disruptions
              out of cyberspace.<p></p>■ Corporate (fund) and Individual (empower)<p></p>
              If you’re a pioneering thinker or start-up ready to make an impact on the world this is the place. Create
              your own CyOperation and get funded and empowered by the cyberpunk community.<p></p>
              We are the CyOperators, we are the OG - through blockchain we provide a place of unparalleled social and
              economic experimentation – without limitations.<p></p>
            </p>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>executed</span>
              <span className="text-desc">
                {values.winningCyOps.length}
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">cryptosphere</span>
              <span className="text-desc">
                {values.cryptosphereWinningCyOps.length}
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">individual</span>
              <span className="text-desc">
                {values.individualWinningCyOps.length}
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">corporate</span>
              <span className="text-desc">
                {values.corporateWinningCyOps.length}
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="">active</span>
              <span className="text-desc">{values.cyops.length}</span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">cryptosphere</span>
              <span className="text-desc">
                {values.cryptosphereCyOps.length} (
                {Math.round((values.cryptosphereCyOps.length * 100) / values.cyops.length)})
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">individual</span>
              <span className="text-desc">
                {values.individualCyOps.length} (
                {Math.round((values.individualCyOps.length * 100) / values.cyops.length)})
              </span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span className="ps-2">corporate</span>
              <span className="text-desc">
                {values.corporateCyOps.length} ({Math.round((values.corporateCyOps.length * 100) / values.cyops.length)}
                )
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "cyopnomics",
      relatedCommands: ["intro", "tax", "protocol", "help"],
      documentNumber: "H7 EEQ07261",
      description: (
        <div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            The native token is $CyOp. Members can use $CyOp to participate within the Protocol and earn $USDC rewards.
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>Total supply | deflationary</span>
              <span className="text-desc text-end">{values.circulatingSupply} $CyOp</span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between gap-2">
              <span className="">contract</span>
              <span className="text-desc text-break text-end">0xddaC9C604BA6Bc4ACEc0FBB485B83f390ECF2f31</span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>Tax | diminishing until hitting 1%</span>
              <span className="text-desc text-end">10%</span>
            </div>
          </div>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
            <div className="d-flex justify-content-between">
              <span>liquidity</span>
              <span className="text-desc text-end">${values.cyopEthLiquidity}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      command: "contact",
      relatedCommands: ["corp", "help"],
      documentNumber: "E5 TGT52319",
      description: <div>Reach out to CyOpProtocol at protonmail dot com</div>
    },
    {
      command: "links",
      relatedCommands: ["help", "clear"],
      documentNumber: "E5 DST620091",
      description: (
        <div className="command-links">
          <li>
            <a href="https://twitter.com/CyOpProtocol" target="_blank" rel="noreferrer">
              twitter
            </a>
            <br />
          </li>
          <li>
            <a href="https://t.me/CyOpProtocol" target="_blank" rel="noreferrer">
              telegram community
            </a>
            <br />
          </li>
          <li>
            <a href="https://t.me/CyOpAnnouncement" target="_blank" rel="noreferrer">
              telegram announcement
            </a>
            <br />
          </li>
          <li>
            <a href="https://cyop.gitbook.io/thegrid" target="_blank" rel="noreferrer">
              grid paper
            </a>
          </li>
          <li>
            <a href="https://coinmarketcap.com/currencies/cyop-protocol/" target="_blank" rel="noreferrer">
              coinmarketcap
            </a>
            <br />
          </li>
          <li>
            <a href="https://www.coingecko.com/en/coins/cyop-protocol" target="_blank" rel="noreferrer">
              coingecko
            </a>
            <br />
          </li>
          <li>
            <a
              href="https://www.dextools.io/app/ether/pair-explorer/0x1b1c28a89caac877c63d0adac173a0b55921ab65"
              target="_blank"
              rel="noreferrer">
              dextools
            </a>
            <br />
          </li>
          <li>
            <a
              href="https://app.uniswap.org/#/swap?outputCurrency=0xddac9c604ba6bc4acec0fbb485b83f390ecf2f31"
              target="_blank"
              rel="noreferrer">
              uniswap
            </a>
            <br />
          </li>
          <li>
            <a href="https://www.bitmart.com/trade/en?symbol=CYOP_USDT&layout=basic" target="_blank" rel="noreferrer">
              bitmart
            </a>
            <br />
          </li>
          <li>
            <a
              href="https://etherscan.io/token/0xddac9c604ba6bc4acec0fbb485b83f390ecf2f31"
              target="_blank"
              rel="noreferrer">
              etherscan
            </a>
          </li>
          <li>
            <a href="https://opensea.io/collection/cyop" target="_blank" rel="noreferrer">
              opensea
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UCnqwVkLKzJDERKDL9oBc3Zw/featured"
              target="_blank"
              rel="noreferrer">
              youtube
            </a>
          </li>
          <li>
            <a href="https://twitter.com/CyOpSyndicate" target="_blank" rel="noreferrer">
              syndicate
            </a>
          </li>
          <li>
            <a href="https://uponlymerch.com/collections/cyop" target="_blank" rel="noreferrer">
              merchandise
            </a>
          </li>
        </div>
      )
    },
    {
      command: "help",
      description: (
        <div>
          <CommandListItem command="intro" />
          <CommandListItem command="corp" />
          <CommandListItem command="protocol" />
          <CommandListItem command="metagrid" />
          <CommandListItem command="unft" />
          <CommandListItem command="merchandise" />
          <CommandListItem command="cyopnomics" />
          <CommandListItem command="links" />
          <CommandListItem command="gridpaper" />
          <CommandListItem command="treasury" />
          <CommandListItem command="tax" />
          <CommandListItem command="void" />
          <CommandListItem command="rewards" />
          <CommandListItem command="burn" />
          <CommandListItem command="recharge" />
          <CommandListItem command="cycle" />
          <CommandListItem command="cyoperations" />
          <CommandListItem command="ranking" />
          <CommandListItem command="syndicate" />
          <CommandListItem command="terminal" />
          <CommandListItem command="contact" />
          <CommandListItem command="help" />
          <CommandListItem command="clear" />
        </div>
      )
    },
    {
      command: "treasury",
      relatedCommands: ["protocol", "help"],
      documentNumber: "JW D83991",
      description: (
        <div>
          powerful - recharging - expanding
          <br />
          A whole ecosystem of various income streams  “energizes” the protocol.<p></p>
            <li>
              Void holding sales
            </li>
            <li>
              Metagrid applications generating new streams
            </li>
            <li>
              In DAPP crypto advertisement with privacy protection
            </li>
            <li>
              10% $CyOp buy tax
            </li>
            <li>
              10% $CyOp sell tax
            </li>
            <li>
              10% $CyOp transaction tax
            </li>
            <li>
              8% uNFT sell tax
            </li>
            <li>
              Recharge fund
            </li>
          </div>
      )
    },
    {
      command: "ranking",
      relatedCommands: ["corp", "help"],
      documentNumber: "CS H4CK1N5",
      description: (
        <div>
          YOUR CORPORATE HACKING SKILL
          <br />
          Use your voting power and/or uNFTs to improve your hacking skills. This way you will rise in rank within the corporation - it's worth it.<p></p>
          In exchange, you will receive a voting bonus to be used in the given cycle. Additional benefits related to influencing DAC governance decisions will be enabled in an upcoming release.<p></p>
          </div>
      )
    },
    {
      command: "gridpaper",
      documentNumber: "THE GRID V.2.0.0",
      relatedCommands: ["help"],
      description: (
        <div>
            <a href="https://cyop.gitbook.io/thegrid/" target="_blank" rel="noreferrer">Tune into the grid and read about the inner workings of the CyOp CORP</a>
        </div>
      )
    },
    {
      command: "syndicate",
      relatedCommands: ["corp", "help"],
      documentNumber: "FU SOC1520X",
      description: (
        <div>
          THE SYNDICATE WITHIN!
          <br />
          The protocol was successfully run several times in its first version. So the number of users grew rapidly and
          spawned the new CyOp Corporation.<p></p>
          At its core, a benevolent syndicate arose, consisting of dedicated users aka CyOperators united and awakened
          under the following principle…<p></p>
          <b>THE CYOP PLEDGE:</b>
          <br />
          I pledge allegiance to the CyOp Protocol and to the idea of disruption for which it stand, by tuning into the
          grid and advertising the DAC, rewarding the stakeholders and pushing one coin to rule them all!
          <br />
          <br />
          <b>HOW TO START:</b>
          <br />
          ■ talk about CyOp
          <br />■{" "}
          <a href="https://twitter.com/CyOpProtocol" target="_blank" rel="noreferrer">
            follow @CyOpProtocol
          </a>
          <br />
          ■ add #CyOperator to bio
          <br />
          ■ add CyOpSyndicate as profile avatar
          <br />■{" "}
          <a href="https://twitter.com/CyOpSyndicate" target="_blank" rel="noreferrer">
            follow @CyOpSyndicate
          </a>
          <br />■{" "}
          <a href="https://t.me/CyOpProtocol" target="_blank" rel="noreferrer">
            join Telegram
          </a>
        </div>
      )
    },

    {
      command: "merchandise",
      relatedCommands: ["intro", "help"],
      documentNumber: "ST R33TW4R3",
      description: (
        <div>
          Merch from Paris with style, exclusively designed by our users for the Cyberpunks:<p></p>
          This is the Ultra Heavy Cyber Streetware Collection. Timeless - ever expanding - build to wear.<p></p>
          <a href="https://uponlymerch.com/collections/cyop" target="_blank" rel="noreferrer">
            Gear up now!
          </a>
        </div>
      )
    },
    {
      command: "matrix",
      relatedCommands: [],
      documentNumber: "NEO 11001110",
      description: (
        <div>
          Call trans opt: received. 8-30-18 00:00:00
          <br />
          Trace program: running<p></p>
          Wake up, Neo...
          <br />
          The Matrix has you...
          <br />
          Follow the white rabbit.
          <br />
          Knock, knock, Neo.
        </div>
      )
    },
    {
      command: "clear",
      relatedCommands: [],
      description: ""
    }
  ];

  const getContent = (_command: string) => {
    const command_content = COMMAND_LIST.find((command) => command.command === _command.toLowerCase());
    return command_content;
  };

  const onBlurInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  // useEffect(() => {
  //   if (!command) return
  //   // if (commandRef.current) {
  //   //   commandRef.current.scrollIntoView();
  //   // }

  //   if (!isMobile) {
  //     // if (inputRef.current) {
  //     //   inputRef.current.addEventListener('blur', onBlurInput);
  //     // }

  //     const interval = setInterval(() => {
  //       if (inputRef.current) {
  //         inputRef.current.focus();
  //       }
  //     }, 300);

  //     return () => {
  //       clearInterval(interval);
  //       if (inputRef.current) {
  //         // eslint-disable-next-line
  //         inputRef.current.removeEventListener('blur', onBlurInput);
  //       }
  //     };
  //   }
  // }, [isMobile, windowWidth, command]);

  const handleMainClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = (cmd: string) => {
    // play();
    setCommand(cmd);
    const content = getContent(cmd);
    onBlurInput();

    if (commandRef.current) {
      commandRef.current.scrollIntoView();
    }

    if (content) {
      setLoadingCommand(true);
      setInputCommand("");
      // playCmd();
      switch (cmd) {
        case "clear":
          setInputCommand("");
          setLoadingCommand(false);
          playDocument();
          break;
        case "help":
          loadContent(content, cmd);
          setLoadingCommand(false);
          playDocument();
          break;
        default:
          setTimeout(() => {
            loadContent(content, cmd);
            playDocument();
            setLoadingCommand(false);
          }, Math.floor(Math.random() * 1000 + 1000));
          break;
      }
      setCommand("");
    } else {
      const content = (
        <>
          <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2 mt-5">
            <span className="">:\{cmd}</span>
            <br />
          </div>
          <p>command not found</p>
          <span>type 'help' to see all commands</span>
        </>
      );
      setInputCommand(content);
      setCommand("");
    }
  };

  const loadContent = (content: any, cmd: string) => {
    const tempCmd = (
      <div>
        <div className="d-flex gap-2 justify-content-between cyop-border-bottom border-width-1 border-opacity-3 mb-5 cyop-db-docs">
          <span>related_documents</span>
          <div className="d-flex related-commands justify-content-between">
            {content.relatedCommands?.map((relatedCommand: string) => (
              <span className="text-desc command-click" onClick={() => onClickCommand(relatedCommand)}>
                {relatedCommand}
              </span>
            ))}
          </div>
        </div>
        <div className="cyop-border-bottom border-width-1 border-opacity-3 mb-2">
          <span className="">:\{cmd}</span>
        </div>
        <div>{content.description}</div>
        <br />
      </div>
    );
    setInputCommand(tempCmd);
    setDocumentNumber(content.documentNumber);
  };

  const handleKeyDownInput = (e: any) => {
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    if (keycode === 37 || keycode === 39) {
      // arrow left or arrow right
      e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();

      // first check if the content is valid
      if (!(e.target instanceof HTMLElement)) {
        return;
      }
      handleCommand(command);
    }
  };

  useEffect(() => {
    setTotalHoldings(values.recharge + values.rewardFundAmount + values.distributorAmount + values.holdingTokensTotal)
  }, []);

  return (
    <div className="d-flex f-column" onClick={handleMainClick}>
      <div className="d-flex py-3">
        <span>CyOp:\Terminal&gt;</span>
        {/* <div className="w-100">
          <span className="co-command-field" ref={commandRef}>
            {command}
          </span>
        </div> */}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="cyop-input"
        value={command}
        onKeyDown={handleKeyDownInput}
        onChange={(e) => setCommand(e.target.value)}
      />
    </div>
  );
};

export default CommandInputV2;
