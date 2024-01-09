import { BigNumber } from "ethers";
import { formatUnits } from "helpers/utils";
import { IUserVote } from "shared/interfaces";
import { useNavigate } from "react-router-dom";
import { timeAgo, intToString } from "helpers/utils";
import { Fragment } from "react";
import { decimals } from "shared/constants";

export const AccountActivities: React.FC<{ data: IUserVote[] }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <table className="cyop-table table-hover table-responsive">
      <thead>
        <tr>
          <th scope="col">type</th>
          <th scope="col">input</th>
          <th scope="col" className="hide-down-sm">
            root
          </th>
          <th scope="col">time</th>
        </tr>
      </thead>
      <tbody>
        {data
          ? data
              .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
              .map((activity) => (
                <Fragment key={activity._id}>
                  {!BigNumber.from(activity.power).isZero() && (
                    <>
                      <tr>
                        <td>vote</td>
                        <td>
                          {intToString(parseFloat(formatUnits(BigNumber.from(activity.power), decimals.CyOp, false))) + " CyOp"}
                        </td>
                        <td
                          className="hide-down-sm"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/cyoperations/" + activity.cyoperation)}
                        >
                          {activity.cyoperationName}
                        </td>
                        <td className="time">
                          {timeAgo(activity.datetime)} {/*activity.tag && '.' + activity.tag*/}
                        </td>
                      </tr>
                    </>
                  )}
                  {activity.skill && (
                    <>
                      <tr>
                        <td>unft</td>
                        <td>
                          {activity.skill.name}
                        </td>
                        <td
                          className="hide-down-sm"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/cyoperations/" + activity.cyoperation)}
                        >
                          {activity.cyoperationName}
                        </td>
                        <td className="time">
                          {timeAgo(activity.datetime)} {/*activity.tag && '.' + activity.tag*/}
                        </td>
                      </tr>
                    </>
                  )}
                </Fragment>
              ))
          : ""}
      </tbody>
    </table>
  );
};

export default AccountActivities;
