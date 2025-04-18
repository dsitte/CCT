import "reflect-metadata";
import assert from "node:assert";
import getServer from "./getServer";

import * as matchers from "jest-extended";
expect.extend(matchers);

const executeQuery = async (query: string) => {
  const { server, prisma } = await getServer();

  return await server.executeOperation(
    {
      query,
    },
    { contextValue: { prisma } }
  );
};

describe("GraphQL Integration Tests", () => {
  test("fetchTeamRecords", async () => {
    const expected = [
      {
        id: "team-001",
        name: "Thunderbolts",
        losses: 2,
        ties: 1,
        wins: 8,
      },
      {
        id: "team-002",
        name: "Lightning",
        losses: 3,
        ties: 1,
        wins: 7,
      },
      {
        id: "team-003",
        name: "Hurricanes",
        losses: 5,
        ties: 1,
        wins: 5,
      },
      {
        id: "team-004",
        name: "Tornadoes",
        losses: 6,
        ties: 1,
        wins: 4,
      },
      {
        id: "team-005",
        name: "Cyclones",
        losses: 1,
        ties: 0,
        wins: 9,
      },
      {
        id: "team-006",
        name: "Twisters",
        losses: 3,
        ties: 1,
        wins: 6,
      },
      {
        id: "team-007",
        name: "Storms",
        losses: 4,
        ties: 1,
        wins: 5,
      },
      {
        id: "team-008",
        name: "Blizzards",
        losses: 7,
        ties: 0,
        wins: 3,
      },
    ];

    const actual = await executeQuery(
      `query Query {
        teams {
          id
          name
          losses
          ties
          wins
        }
      }`
    );

    assert(actual.body.kind === "single");
    expect(actual.body.singleResult.errors).toBeUndefined();
    expect(actual.body.singleResult.data?.teams).toIncludeSameMembers(expected);
  });

  test("fetchAttendanceByWeather", async () => {
    const expected = [
      {
        _avg: {
          attendance: 120,
        },
        weatherConditions: "Cloudy",
      },
      {
        _avg: {
          attendance: 142.5,
        },
        weatherConditions: "Partly Cloudy",
      },
      {
        _avg: {
          attendance: 146,
        },
        weatherConditions: "Sunny",
      },
    ];

    const actual = await executeQuery(
      `query GroupByPlayer {
        groupByGame(by: weatherConditions) {
          _avg {
            attendance
          }
          weatherConditions
        }
      }`
    );

    assert(actual.body.kind === "single");
    expect(actual.body.singleResult.errors).toBeUndefined();
    expect(actual.body.singleResult.data?.groupByGame).toIncludeSameMembers(
      expected
    );
  });

  test("fetchAttendanceByDate", async () => {
    const expected = [
      {
        _sum: {
          attendance: 265,
        },
        date: "2023-09-05T00:00:00.000Z",
      },
      {
        _sum: {
          attendance: 295,
        },
        date: "2023-09-07T00:00:00.000Z",
      },
      {
        _sum: {
          attendance: 275,
        },
        date: "2023-09-12T00:00:00.000Z",
      },
      {
        _sum: {
          attendance: 300,
        },
        date: "2023-09-14T00:00:00.000Z",
      },
    ];

    const actual = await executeQuery(
      `query Query {
        groupByGame(by: date) {
          _sum {
            attendance
          }
          date
        }
      }`
    );

    assert(actual.body.kind === "single");
    expect(actual.body.singleResult.errors).toBeUndefined();
    expect(actual.body.singleResult.data?.groupByGame).toIncludeSameMembers(
      expected
    );
  });

  test("fetchAttendanceByDivision", async () => {
    const expected = [
      {
        date: "2023-09-05T00:00:00.000Z",
        division: "U12",
        _sum: {
          attendance: 265,
        },
      },
      {
        date: "2023-09-07T00:00:00.000Z",
        division: "U14",
        _sum: {
          attendance: 295,
        },
      },
      {
        date: "2023-09-12T00:00:00.000Z",
        division: "U12",
        _sum: {
          attendance: 275,
        },
      },
      {
        date: "2023-09-14T00:00:00.000Z",
        division: "U14",
        _sum: {
          attendance: 300,
        },
      },
    ];
    const actual = await executeQuery(
      `query GroupByGame {
        groupByGame(by: [date, division]) {
          date
          division
          _sum {
            attendance
          }
        }
      }`
    );

    assert(actual.body.kind === "single");
    expect(actual.body.singleResult.errors).toBeUndefined();
    expect(actual.body.singleResult.data?.groupByGame).toIncludeSameMembers(
      expected
    );
  });

  test("fetchGoalsByDivision", async () => {
    const expected = [
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

    const actual = await executeQuery(
      `query GroupByTeamsInGame {
        games {
          date
          division
          ScorersInGame {
            goals
          }
        }
      }`
    );

    assert(actual.body.kind === "single");
    expect(actual.body.singleResult.errors).toBeUndefined();
    console.log(
      JSON.stringify(actual.body.singleResult.data?.games, undefined, 2)
    );
    expect(actual.body.singleResult.data?.games).toIncludeSameMembers(expected);
  });
});
