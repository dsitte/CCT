import { gql, TypedDocumentNode } from "@apollo/client";

type Sum<T extends string> = {
  _sum: Record<T, number>;
};

export type FetchTeamRecordsResp = {
  teams: {
    id: string;
    name: string;
    losses: number;
    ties: number;
    wins: number;
  }[];
};

export const FetchTeamRecords: TypedDocumentNode<FetchTeamRecordsResp> = gql`
  query Query {
    teams {
      id
      name
      losses
      ties
      wins
    }
  }
`;

export type FetchAttendanceByWeatherRecordsResp = {
  groupByGame: {
    _avg: {
      attendance: number;
    };
    weatherConditions: string;
  }[];
};

export const FetchAttendanceByWeather: TypedDocumentNode<FetchAttendanceByWeatherRecordsResp> = gql`
  query GroupByPlayer {
    groupByGame(by: weatherConditions) {
      _avg {
        attendance
      }
      weatherConditions
    }
  }
`;

export type FetchAttendanceByDateResp = {
  groupByGame: ({
    date: string;
  } & Sum<"attendance">)[];
};

export const FetchAttendanceByDate: TypedDocumentNode<FetchAttendanceByDateResp> = gql`
  query Query {
    groupByGame(by: date) {
      _sum {
        attendance
      }
      date
    }
  }
`;

export type FetchAttendanceByDivisionResp = {
  groupByGame: ({
    date: string;
    division: string;
  } & Sum<"attendance">)[];
};

export const FetchAttendanceByDivision: TypedDocumentNode<FetchAttendanceByDivisionResp> = gql`
  query GroupByGame {
    groupByGame(by: [date, division]) {
      date
      division
      _sum {
        attendance
      }
    }
  }
`;

export type FetchGoalsByDivisionResp = {
  games: {
    date: string;
    division: string;
    ScorersInGame: {
      goals: number;
    }[];
  }[];
};

export const FetchGoalsByDivision: TypedDocumentNode<FetchGoalsByDivisionResp> = gql`
  query GroupByTeamsInGame {
    games {
      date
      division
      ScorersInGame {
        goals
      }
    }
  }
`;
