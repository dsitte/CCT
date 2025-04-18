import * as matchers from "jest-extended";
import {
  _rbtTeamOrder,
  _rbtTransform,
  goalsByDivisionTransform,
} from "./transforms";
expect.extend(matchers);

describe("Transforms", () => {
  test("recordByTeam_transform happy path", () => {
    const input = [
      {
        id: "1",
        name: "1",
        wins: 0,
        ties: 0,
        losses: 0,
      },
      {
        id: "2",
        name: "2",
        wins: 1,
        ties: 2,
        losses: 3,
      },
      {
        id: "3",
        name: "3",
        wins: 99,
        ties: 0,
        losses: -1,
      },
    ];

    const expected = [
      {
        name: "1",
        type: "wins",
        count: 0,
      },
      {
        name: "1",
        type: "ties",
        count: 0,
      },
      {
        name: "1",
        type: "losses",
        count: 0,
      },
      {
        name: "2",
        type: "wins",
        count: 1,
      },
      {
        name: "2",
        type: "ties",
        count: 2,
      },
      {
        name: "2",
        type: "losses",
        count: 3,
      },
      {
        name: "3",
        type: "wins",
        count: 99,
      },
      {
        name: "3",
        type: "ties",
        count: 0,
      },
      {
        name: "3",
        type: "losses",
        count: -1,
      },
    ];

    const actual = _rbtTransform(input);

    expect(actual).toIncludeSameMembers(expected);
  });

  test("recordByTeam_transform empty array", () => {
    const actual = _rbtTransform([]);
    expect(actual).toEqual([]);
  });

  test("recordByTeam_teamOrder happy path", () => {
    const input = [
      {
        id: "1",
        name: "1",
        wins: 0,
        ties: 0,
        losses: 0,
      },
      {
        id: "2",
        name: "2",
        wins: 1,
        ties: 2,
        losses: 3,
      },
      {
        id: "3",
        name: "3",
        wins: 99,
        ties: 0,
        losses: -1,
      },
    ];

    const expected = ["3", "2", "1"];

    const actual = _rbtTeamOrder(input);

    expect(actual).toEqual(expected);
  });

  test("recordByTeam_teamOrder empty array", () => {
    const actual = _rbtTeamOrder([]);
    expect(actual).toEqual([]);
  });

  test("goalsByDivision happy path", () => {
    const input = [
      {
        date: "2023-09-05T00:00:00.000Z",
        division: "U12",
        ScorersInGame: [
          {
            goals: 2,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-05T00:00:00.000Z",
        division: "U12",
        ScorersInGame: [
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-07T00:00:00.000Z",
        division: "U14",
        ScorersInGame: [
          {
            goals: 2,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-07T00:00:00.000Z",
        division: "U14",
        ScorersInGame: [
          {
            goals: 2,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-12T00:00:00.000Z",
        division: "U12",
        ScorersInGame: [
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-12T00:00:00.000Z",
        division: "U12",
        ScorersInGame: [
          {
            goals: 2,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-14T00:00:00.000Z",
        division: "U14",
        ScorersInGame: [
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
      {
        date: "2023-09-14T00:00:00.000Z",
        division: "U14",
        ScorersInGame: [
          {
            goals: 3,
          },
          {
            goals: 1,
          },
          {
            goals: 1,
          },
        ],
      },
    ];

    const expected = [
      {
        division: "U12",
        date: new Date("2023-09-05T00:00:00.000Z"),
        totalGoals: 9,
      },
      {
        division: "U12",
        date: new Date("2023-09-12T00:00:00.000Z"),
        totalGoals: 8,
      },
      {
        division: "U14",
        date: new Date("2023-09-07T00:00:00.000Z"),
        totalGoals: 9,
      },
      {
        division: "U14",
        date: new Date("2023-09-14T00:00:00.000Z"),
        totalGoals: 9,
      },
    ];

    const actual = goalsByDivisionTransform(input);

    expect(actual).toIncludeSameMembers(expected);
  });

  test("goalsByDivision empty array", () => {
    const actual = goalsByDivisionTransform([]);
    expect(actual).toEqual([]);
  });
});
