import { useSuspenseQuery } from "@apollo/client";
import {
  FetchAttendanceByDivision,
  FetchAttendanceByDivisionResp,
} from "../queries";
import React, { useState } from "react";

import { LineYOptions, PlotOptions } from "@observablehq/plot";
import LinePlot from "./BasePlots/LinePlot";

const lineOptions = {
  x: "date",
  y: "attendance",
  stroke: "division",
} satisfies LineYOptions;

const plotOptions = {
  color: { legend: true },
} satisfies PlotOptions;

const AttendanceByDivision = () => {
  const {
    data: { groupByGame },
  } = useSuspenseQuery<FetchAttendanceByDivisionResp>(
    FetchAttendanceByDivision
  );

  const [transformedData] = useState(() =>
    groupByGame.map(({ _sum: { attendance }, date, division }) => ({
      attendance,
      date: new Date(date),
      division,
    }))
  );

  return (
    <LinePlot
      data={transformedData}
      plotOptions={plotOptions}
      lineOptions={lineOptions}
    />
  );
};

export default React.memo(AttendanceByDivision);
