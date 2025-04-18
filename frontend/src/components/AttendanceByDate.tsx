import { useSuspenseQuery } from "@apollo/client";
import { FetchAttendanceByDate, FetchAttendanceByDateResp } from "../queries";
import React, { useState } from "react";

import { LineYOptions } from "@observablehq/plot";
import LinePlot from "./BasePlots/LinePlot";

const lineOptions = {
  x: "date",
  y: "attendance",
  stroke: "#efb118",
} satisfies LineYOptions;

const AttendanceByDate = () => {
  const {
    data: { groupByGame },
  } = useSuspenseQuery<FetchAttendanceByDateResp>(FetchAttendanceByDate);

  const [transformedData] = useState(() =>
    groupByGame.map(({ _sum: { attendance }, date }) => ({
      attendance,
      date: new Date(date),
    }))
  );

  return <LinePlot data={transformedData} lineOptions={lineOptions} />;
};

export default React.memo(AttendanceByDate);
