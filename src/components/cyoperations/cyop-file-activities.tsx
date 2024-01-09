import { BigNumber } from "ethers";
import { formatUnits, simplifiedWalletAddress } from "helpers/utils";
import { IUserVote } from "shared/interfaces";
import { timeAgo, intToString } from "helpers/utils";
import { Fragment } from "react";
import { decimals } from "shared/constants";

export const CyopFileActivities: React.FC<{ data: IUserVote[] }> = ({ data }) => {
  return (
    <table className="cyop-table table-hover table-responsive">
      <thead>
        <tr>
          <th scope="col" className="hide-down-sm">
            user
          </th>
          <th scope="col">type</th>
          <th scope="col">input</th>
          <th scope="col">time</th>
        </tr>
      </thead>
      <tbody>
        {data
          .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
          .map((activity) => {
            return (
              <Fragment key={activity._id}>
                {(activity.power === null || !BigNumber.from(activity.power).isZero()) && (
                  <tr>
                    <td className="hide-down-sm">{simplifiedWalletAddress(activity.walletAddress)}</td>
                    <td>vote</td>
                    <td>
                      {activity.power != null
                        ? intToString(parseFloat(formatUnits(BigNumber.from(activity.power), decimals.CyOp, false))) + " CyOp"
                        : "#M@$K3D"}
                    </td>
                    <td className="time">
                      {timeAgo(activity.datetime)} {/*activity.tag && '.' + activity.tag*/}
                    </td>
                  </tr>
                )}
                {activity.skill && (
                  <tr>
                    <td className="hide-down-sm">{simplifiedWalletAddress(activity.walletAddress)}</td>
                    <td>unft</td>
                    <td>{activity.skill.name}</td>
                    <td className="time">
                      {timeAgo(activity.datetime)} {/*activity.tag && '.' + activity.tag*/}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
      </tbody>
    </table>
  );
};

export default CyopFileActivities;
