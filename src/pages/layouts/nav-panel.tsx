import { useState, useEffect, FC } from "react";
import { simplifiedWalletAddress } from "helpers/utils";
import { Fade } from "react-awesome-reveal";
import { useNavigate, useLocation } from "react-router-dom";
import useWeb3 from "shared/hooks/useWeb3";

interface IPageRoute {
  id: string;
  link: string;
  label: string;
  path: string;
  children?: IPageRoute[];
  extended?: boolean;
}

const PAGES: IPageRoute[] = [
  {
    id: "nav-account",
    link: "",
    label: "Account",
    path: "/",
    extended: true,
    children: [
      {
        id: "nav-account-activity",
        link: "/account/activity",
        label: "Activity",
        path: "/activity"
      },
      {
        id: "nav-account-cyop",
        link: "/account/cyop",
        label: "CyOp",
        path: "/cyop"
      },
      {
        id: "nav-account-unft",
        link: "/account/unft",
        label: "uNFT",
        path: "/unft"
      }
    ]
  },
  {
    id: "nav-cyop",
    link: "/cyoperations",
    label: "Cyoperations",
    path: "/cyoperations"
  },
  {
    id: "nav-database",
    link: "/database",
    label: "Database",
    path: "/database"
  },
  {
    id: "nav-metagrid",
    link: "/metagrid",
    label: "Metagrid",
    path: "/metagrid"
  },
  {
    id: "nav-exchange",
    link: "/exchange",
    label: "Exchange",
    path: "/exchange"
  },
  {
    id: "wallet-connect",
    link: "/wallet-connect",
    label: "Disconnect",
    path: "/wallet-connect"
  }
];

interface NavLinkProps extends IPageRoute {
  currentPath: string;
  setPath: (path: string) => void;
  extended?: boolean;
}

const NavLink: FC<NavLinkProps> = ({ id, link, label, path, currentPath, children, setPath, extended }) => {
  const [state, setState] = useState({ id, link, label, path, children, extended });
  const navigate = useNavigate();
  const { handleDisconnect } = useWeb3();

  const updateState = async (e: any) => {
    e.stopPropagation();
    if (e.target.id === "wallet-connect") {
      await handleDisconnect();
    }
    if (state.children) {
      setState({ ...state, extended: !state.extended });
    }
    if (state.link) {
      navigate(state.link);
      if (setPath) {
        setPath(state.path);
      }
    }
  };

  useEffect(() => {
    setState({ ...state, label });
    // eslint-disable-next-line
  }, [label]);
  return (
    <li
      onClick={(e) => updateState(e)}
      className={`co-nav-link-li text-start ${currentPath === state.path ? "current" : ""} ${
        state.children ? (state.extended ? "parent-extended" : "parent-collapsed") : "child"
      }`}
      id={state.id}
    >
      {state.label}
      {state.extended && state.children && (
        <ul>
          {state.children.map((item) => (
            <NavLink {...item} setPath={setPath} extended={item.extended} key={item.id} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
};


interface INavPanel {
  path: string
  setPath: (path: string) => void
}
export const NavPanel: FC<INavPanel> = ({ path, setPath }) => {
  const location = useLocation();
  const { connected, walletAddress } = useWeb3();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<Array<IPageRoute>>(PAGES);

  const redirectToWalletConnect = () => {
    navigate("/wallet-connect" + location.pathname);
  };

  useEffect(() => {
    if (!connected) redirectToWalletConnect();
    // eslint-disable-next-line
  }, [connected]);

  useEffect(() => {
    if (!walletAddress) return;
    const tempMenuItems = [...menuItems];
    const accountIndex = tempMenuItems.findIndex((item) => item.id === "nav-account");
    tempMenuItems[accountIndex].label = "Account [" + simplifiedWalletAddress(walletAddress) + "]";
    setMenuItems(tempMenuItems);

    // eslint-disable-next-line
  }, [walletAddress]);

  return (
    <div className="co-nav-panel container-fluid mt-2 px-1">
      <div className="co-nav-status px-2 text-start">{`Browser - ${path}`}</div>
      <div className="co-nav-list flex-1">
        <ul>
          {menuItems.map((page) => (
            <Fade cascade key={page.id}>
              <NavLink {...page} setPath={setPath} extended={page.extended} currentPath={path} />
            </Fade>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavPanel;
