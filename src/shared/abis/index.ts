import IERC20 from "./IERC20.json";
import DAO from "./DAO.json";
import Bridge from "./Bridge.json";
import Vault from "./Vault.json";
import uNFT from "./uNFT.json";
import Cycle from "./Cycle.json";
import Distributor from "./Distributor.json";
import UniswapRouterV2 from "./UniswapRouterV2.json";
import UniswapPair from "./UniswapPair.json";

const abis = {
  CyOp: IERC20,
  IERC20: IERC20,
  DAO: DAO,
  Bridge: Bridge,
  Vault: Vault,
  uNFT: uNFT,
  Cycle: Cycle,
  Distributor: Distributor,
  UniswapRouterV2: UniswapRouterV2,
  UniswapPair: UniswapPair
};

export default abis;
