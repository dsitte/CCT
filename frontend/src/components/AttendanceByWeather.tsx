import { useSuspenseQuery } from "@apollo/client";
import {
  FetchAttendanceByWeather,
  FetchAttendanceByWeatherRecordsResp,
} from "../queries";
import React, { useState } from "react";
import BarPlot from "./BasePlots/BarPlot";
import { BarYOptions, PlotOptions } from "@observablehq/plot";

const barOptions = {
  x: "weatherConditions",
  y: "attendance",
  fill: "#4269d0",
} satisfies BarYOptions;

const plotOptions = {
  color: { legend: true },
  x: { label: null },
} satisfies PlotOptions;

const AttendanceByWeather = () => {
  const {
    data: { groupByGame },
  } = useSuspenseQuery<FetchAttendanceByWeatherRecordsResp>(
    FetchAttendanceByWeather
  );

  const [transformedData] = useState(() =>
    groupByGame.map(({ _avg: { attendance }, weatherConditions }) => ({
      attendance,
      weatherConditions,
    }))
  );

  return (
    <BarPlot
      data={transformedData}
      barOptions={barOptions}
      plotOptions={plotOptions}
    />
  );
};

export default React.memo(AttendanceByWeather);
