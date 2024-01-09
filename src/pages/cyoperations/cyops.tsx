import { useState, useEffect, ReactNode, useCallback, ChangeEvent } from "react";
import TreeNode from "components/base/tree-node";
import Loading from "components/loading";
import Button from "components/base/button";
import plus_icon from "assets/images/button-icons/plus-button-icon.png";
import double_right_arrow from "assets/images/button-icons/double-right-arrow-icon.png";
import double_left_arrow from "assets/images/button-icons/double-left-arrow-icon.png";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useAudio } from "react-awesome-audio";
import useContracts from "../../shared/hooks/useContracts";
import { ICyOpNode, ICyOp } from "../../shared/interfaces";
import { getFilteredCyOpsTo, getWinningProposals } from "shared/backend";
import Fuse from "fuse.js"; 
import {DebounceInput} from 'react-debounce-input';
const sndContent = require("assets/audio/content.mp3").default;

export const CyOps = (props: any) => {
  enum FilterMode {
    Popular,
    Latest
  }

  enum Order {
    Ascending,
    Descending
  }

  const numCyopsPerPage = 10;
  const { currentCycle, cyops, setCyOps } = useContracts();
  const [isCyopsLoading, setCyopsLoading] = useState(false);
  const [displayedCycle, setDisplayedCycle] = useState(0);
  const [filterHidden, setFilterHidden] = useState(true);
  const [filterMode, setFilterMode] = useState(FilterMode.Popular);
  const [orderDirection, setOrderDirection] = useState(Order.Descending);
  const [filterCategories, setFilterCategories] = useState<string[]>(["individual", "corporate", "cryptosphere"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fuse, setFuse] = useState<Fuse<ICyOpNode> | null>(null);
  const navigate = useNavigate();

  const fuseOptions: Fuse.IFuseOptions<ICyOpNode> = {
    findAllMatches: true,
    keys: ["title"]
  };

  // used to set count of cyops to be displayed at once, will be increased by 5 when click load more
  const [count, setCount] = useState(numCyopsPerPage);

  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });

  const nodeChild = (cyop: ICyOp) => [
    <Button
      className="px-5 py-1"
      variant="contained"
      onClick={() => {
        navigate("/cyoperations/" + cyop._id);
      }}
    >
      open file
    </Button>,
    <>
      <span className="text-danger">description:\ </span>
      <span>{cyop.description}</span>
    </>,
    <>
      <span className="text-danger">filed to:\ </span>
      <span>{cyop.type}</span>
    </>
  ];

  const renderRootNode = (node: ICyOpNode, loading?: boolean): ReactNode => (
    <div>
      <span>{node.title}</span>
      <span className="ms-1">
        [&nbsp;{loading && <Loading />}
        {!loading && !node.isMasked && <>{node.percent.toFixed(2)}%</>}
        {!loading && node.isMasked && <>##%</>}
        &nbsp;]
      </span>
    </div>
  );

  const onFilterClick = () => {
    setFilterHidden(!filterHidden);
  };

  useEffect(() => {
    if ("setPath" in props && props.setPath) {
      props.setPath("/cyoperations")
    }

    if (!currentCycle) return;
    setDisplayedCycle(currentCycle.toNumber());
  }, []);

  useEffect(() => {
    if (displayedCycle !== 0) {
      updateCyoperations();
    }
  }, [displayedCycle]);

  const onAddCyopClicked = () => {
    navigate("add/target");
  };

  const updateCyoperations = async () => {
    let data = null;
    let votePercentages = null;

    const result =
      displayedCycle === currentCycle?.toNumber()
        ? await getFilteredCyOpsTo(currentCycle.toString())
        : await getWinningProposals(displayedCycle);

    if (result && result.status === 200 && result.data) {
      data = result.data.cyops;
      votePercentages = result.data.votePercentages;
    }

    if (data) {
      let temp: Array<ICyOpNode> = [];

      for (const cyop of data) {
        if (!cyop) continue;

        temp.push({
          title: cyop.name,
          description: cyop.description,
          percent: cyop._id in votePercentages ? votePercentages[cyop._id].percentage : 0,
          children: nodeChild(cyop),
          _id: cyop._id,
          type: cyop.type,
          youtubeId: cyop.youtubeId,
          detailedDescription: cyop.detailedDescription,
          link: cyop.link,
          address: cyop.address,
          creationDate: new Date(cyop.creationDate).getTime(),
          isMarketed: "isMarketed" in cyop ? cyop.isMarketed : false,
          isMasked: "isMasked" in cyop ? cyop.isMasked : false
        });
      }

      if (setCyOps) {
        setCyOps(temp);
      }
    }
  };

  const onPrevCycleClicked = async () => {
    if (displayedCycle > 1) {
      setDisplayedCycle(displayedCycle - 1);
    }
  };

  const onNextCycleClicked = async () => {
    if (currentCycle && displayedCycle < currentCycle.toNumber()) {
      setDisplayedCycle(displayedCycle + 1);
    }
  };

  const handleLoadMoreClicked = () => {
    setCyopsLoading(true);
    setTimeout(() => {
      setCount(count + numCyopsPerPage);
      setCyopsLoading(false);
    }, 500);
  };

  const fitlerCyOps = (cyops: ICyOpNode[]) => {
    if (cyops.length === 0) return [];
    let filteredCyops = cyops.filter((x) => filterCategories.includes(x.type));
    if (filterMode === FilterMode.Popular) {
      if (orderDirection === Order.Descending) {
        filteredCyops = filteredCyops.sort((a, b) => b.percent - a.percent);
      } else if (orderDirection === Order.Ascending) {
        filteredCyops = filteredCyops.sort((a, b) => a.percent - b.percent);
      }
    } else if (filterMode === FilterMode.Latest) {
      if (orderDirection === Order.Descending) {
        filteredCyops = filteredCyops.sort((a, b) => b.creationDate - a.creationDate);
      } else if (orderDirection === Order.Ascending) {
        filteredCyops = filteredCyops.sort((a, b) => a.creationDate - b.creationDate);
      }
    }

    filteredCyops = filteredCyops.sort((a, b) => (a.isMarketed ? -1 : b.isMarketed ? 1 : 0));

    if (searchQuery && fuse) {
      filteredCyops = fuse.search(searchQuery).map(({ item }) => item);
    }

    return filteredCyops;
  };

  const toggleCategory = (cat: string) => {
    if (filterCategories.includes(cat)) {
      setFilterCategories(filterCategories.filter((x) => x !== cat));
    } else {
      setFilterCategories(filterCategories.concat(cat));
    }
  };

  const onSearchQueryChange = (event: any) => {
    setSearchQuery(event.target.value);
  }

  useEffect(() => {
    let timerA: any;

    const playSound = () => {
      play();
      timerA = setTimeout(() => {
        pause();
      }, 1000);
    };
    playSound();

    return () => {
      clearTimeout(timerA);
      pause();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!cyops) return;
    setFuse(new Fuse(cyops, fuseOptions));
  }, [cyops]);

  return (
    <div className="overflow-auto">
      <Fade triggerOnce duration={500} cascade>
        <div className="co-searchbar px-2 d-flex align-items-center mx-1" id="search-bar">
          <div className="me-1">search</div>
          <div className="co-search-field-wrapper">
            <DebounceInput minLength={2} debounceTimeout={300} className="co-search-field" onChange={onSearchQueryChange} />
          </div>
          <div className="ms-auto pointer" onClick={onFilterClick}>
            [filter]
          </div>
        </div>
        <div className="container-fluid" hidden={filterHidden}>
          <Fade>
            <div className="row">
              <div className="col-md-12">
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: filterMode === FilterMode.Popular ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => setFilterMode(FilterMode.Popular)}
                >
                  [popular]
                </span>
                <span
                  className="mx-2"
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: filterMode === FilterMode.Latest ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => setFilterMode(FilterMode.Latest)}
                >
                  [recent]
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: orderDirection === Order.Descending ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => setOrderDirection(Order.Descending)}
                >
                  [desc]
                </span>
                <span
                  className="mx-2"
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: orderDirection === Order.Ascending ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => setOrderDirection(Order.Ascending)}
                >
                  [asc]
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: filterCategories.includes("individual") ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => toggleCategory("individual")}
                >
                  [individual]
                </span>
                <span
                  className="mx-2"
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: filterCategories.includes("corporate") ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => toggleCategory("corporate")}
                >
                  [corporate]
                </span>
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecorationLine: filterCategories.includes("cryptosphere") ? "underline" : "",
                    textDecorationColor: "#FF00A0"
                  }}
                  onClick={() => toggleCategory("cryptosphere")}
                >
                  [cryptosphere]
                </span>
              </div>
            </div>
          </Fade>
        </div>
        <div className=" d-flex justify-content-between mt-3 px-1 py-1" id="cyops-buttons-container">
          <Button variant="text" icon={plus_icon} onClick={onAddCyopClicked} fullWidth>
            upload new cyoperation
          </Button>
          <div className="d-flex mt-3">Cycle #{displayedCycle}</div>
          <div className=" d-flex mt-3 mx-1 py-1" id="cyops-pages-container">
            <div style={{ marginRight: "1rem" }}>
              {currentCycle && displayedCycle < currentCycle.toNumber() && (
                <Button fullWidth variant="text" icon={double_left_arrow} reverse={false} onClick={onNextCycleClicked}>
                  next cycle
                </Button>
              )}
            </div>
            {displayedCycle > 1 && (
              <Button variant="text" icon={double_right_arrow} fullWidth reverse={true} onClick={onPrevCycleClicked}>
                previous cycle
              </Button>
            )}
          </div>
        </div>
      </Fade>

      <div className="px-1 py-3 flex-1">
        <div className="co-treeview">
          {isCyopsLoading && <Loading />}
          {cyops &&
            fitlerCyOps(cyops)
              .slice(0, count) // limit the number of cyops displayed in one screen, increases when load more btn is clicked
              .map((cyop, idx) => (
                <TreeNode
                  key={cyop._id}
                  title={renderRootNode(cyop, isCyopsLoading)}
                  defaultExpanded={[0, 1, 2].includes(idx)} // first 3 children are expanded
                  root={true} // these are root nodes
                >
                  {cyop.children?.map((node, idChild) => (
                    <TreeNode key={`child-${cyop.title}-${idChild}`} title={node} />
                  ))}
                </TreeNode>
              ))}
        </div>
      </div>

      <div className="d-flex">
        {cyops && count < cyops.length && (
          <Button variant="text" className="ps-1" onClick={handleLoadMoreClicked}>
            load more
          </Button>
        )}
      </div>
    </div>
  );
};

export default CyOps;
