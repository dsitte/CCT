import { groupBy, orderBy, sumBy } from "lodash";
import { FetchGoalsByDivisionResp, FetchTeamRecordsResp } from "../queries";

export const _rbtTransform = (teams: FetchTeamRecordsResp["teams"]) =>
  teams.flatMap(({ name, wins, ties, losses }) => [
    {
      name,
      type: "wins",
      count: wins,
    },
    {
      name,
      type: "ties",
      count: ties,
    },
    {
      name,
      type: "losses",
      count: losses,
    },
  ]);

export const _rbtTeamOrder = (teams: FetchTeamRecordsResp["teams"]) =>
  orderBy(teams, ({ wins }) => wins, "desc").map(({ name }) => name);

export const recordByTeamTransform = (
  teams: FetchTeamRecordsResp["teams"]
) => ({
  transformedData: _rbtTransform(teams),
  teamOrder: _rbtTeamOrder(teams),
});

export const goalsByDivisionTransform = (
  games: FetchGoalsByDivisionResp["games"]
) => {
  const mapped = games.map(({ date, division, ScorersInGame: scores }) => ({
    timestamp: new Date(date),
    division,
    goals: sumBy(scores, ({ goals }) => goals),
  }));

  const byDivision = groupBy(mapped, ({ division }) => division);
  return Object.entries(byDivision).flatMap(([division, values]) => {
    const byDate = groupBy(values, ({ timestamp }) => timestamp);
    return Object.entries(byDate).map(([timestamp, val2]) => {
      return {
        division,
        date: new Date(timestamp),
        totalGoals: sumBy(val2, ({ goals }) => goals),
      };
    });
  });
};
