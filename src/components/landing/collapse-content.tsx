import { useState, useEffect, VFC } from "react";


interface ICollapseContent {
  percent: number
  title: string
  content: string
}

export const CollapseContent: VFC<ICollapseContent> = ({ percent, title, content }) => {
  const [isCollapse, setCollapse] = useState(false);
  const [progressComp, setProgressComp] = useState("");
  const [progressMiss, setProgressMiss] = useState("");

  const onClickTitle = () => {
    setCollapse(!isCollapse);
  }

  useEffect(() => {
    let tempTxt = "|";
    let compCnt = percent / 5;
    setProgressComp(tempTxt.repeat(compCnt));
    setProgressMiss(tempTxt.repeat(20 - compCnt));
  }, [])

  return (
    <>
      <div onClick={onClickTitle} className="pointer" style={{ wordBreak: "break-word" }}>
        <span>
          <span className="text-primary">
            {isCollapse && "▲"}
            {!isCollapse && "▼"}
            &nbsp;
          </span>
          <span className="text-white fw-bold">{title}</span>
          &nbsp;
        </span>

        <span className="text-primary collapse-progress">
          [
          <span>{progressComp}</span>
          <span style={{ opacity: "0.3" }}>{progressMiss}&nbsp;&nbsp;&nbsp;</span>
          <span style={{ opacity: "0.3" }}>
            {percent === 100 && "completed"}
            {percent !== 100 && "in progress"}
          </span>
          ]
        </span>
      </div><p />
      {isCollapse &&
        <p className="ps-3">
          {content}
        </p>
      }<p />

    </>
  )
}

export default CollapseContent