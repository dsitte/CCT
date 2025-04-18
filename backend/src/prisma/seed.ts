import fs from "fs";
import path from "path";
import withDB from "../db";

import { Player } from "./generated/prisma";

const readAndParse = (fileName: string) => {
  const raw = fs.readFileSync(path.join(__dirname, "../../data/", fileName), {
    encoding: "utf-8",
  });
  return JSON.parse(raw);
};

type PlayerRecord = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  jerseyNumber: number;
  teamId: string;
};

type GameRecord = {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  location: string;
  division: string;
  attendance: number;
  weatherConditions: string;
  scorers: {
    playerId: string;
    goals: number;
    teamId: string;
  }[];
};

type TeamRecord = {
  id: string;
  name: string;
  division: string;
  wins: number;
  losses: number;
  ties: number;
  pointsScored: number;
  pointsAllowed: number;
  players: string[];
};

const populate = async () => {
  const [games, players, teams] = [
    "games.json",
    "players.json",
    "teams.json",
  ].map(readAndParse) as [GameRecord[], PlayerRecord[], TeamRecord[]];

  await withDB(async (client) => {
    const playerRecords: Player[] = players.map(
      ({ id, firstName, lastName, age, position, jerseyNumber, teamId }) => ({
        id,
        firstName,
        lastName,
        age,
        position,
        jerseyNumber,
        teamId,
      })
    );

    const allPlayers: Record<string, string> = {};
    const teamRecords = teams.map(
      ({
        id,
        name,
        division,
        wins,
        losses,
        ties,
        pointsScored,
        pointsAllowed,
        players,
      }) => {
        players.forEach((playerId) => {
          allPlayers[playerId] = id;
        });
        return {
          id,
          name,
          division,
          wins,
          losses,
          ties,
          pointsScored,
          pointsAllowed,
        };
      }
    );

    const existingPlayerIds = new Set(playerRecords.map(({ id }) => id));
    const allPlayerIds = new Set(Object.keys(allPlayers));
    const johnDoes = allPlayerIds.difference(existingPlayerIds);

    for (const id of johnDoes) {
      playerRecords.push({
        id,
        teamId: allPlayers[id]!,
        firstName: null,
        lastName: null,
        age: null,
        position: null,
        jerseyNumber: null,
      });
    }

    const gameRecords = games.map(
      ({ id, date, location, division, attendance, weatherConditions }) => ({
        id,
        date: new Date(date).toISOString(),
        location,
        division,
        attendance,
        weatherConditions,
      })
    );

    const teamsInGames = games.flatMap(
      ({ id, homeTeam, homeScore, awayTeam, awayScore }) => [
        {
          gameId: id,
          teamId: homeTeam,
          score: homeScore,
          home: true,
        },
        {
          gameId: id,
          teamId: awayTeam,
          score: awayScore,
          home: false,
        },
      ]
    );

    const scorersInGame = games.flatMap(({ scorers, id }) =>
      scorers.map(({ playerId, goals }) => ({ gameId: id, playerId, goals }))
    );

    await client.team.createMany({ data: teamRecords });
    await client.player.createMany({ data: playerRecords });
    await client.game.createMany({ data: gameRecords });
    await client.teamsInGame.createMany({ data: teamsInGames });
    await client.scorersInGame.createMany({ data: scorersInGame });
  });
};

populate().then(
  () => {
    console.log(`DB Populated`);
  },
  (e) => {
    console.error(`Error populating DB`, e);
  }
);
