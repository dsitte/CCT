import { useSuspenseQuery } from "@apollo/client";
import { FetchGoalsByDivision } from "../queries";
import React, { useState } from "react";

import { LineYOptions, PlotOptions } from "@observablehq/plot";
import LinePlot from "./BasePlots/LinePlot";
import { goalsByDivisionTransform } from "../utils/transforms";

const lineOptions = {
  x: "date",
  y: "totalGoals",
  stroke: "division",
} satisfies LineYOptions;

const plotOptions = {
  color: { legend: true },
} satisfies PlotOptions;

const GoalsByDivision = () => {
  const {
    data: { games },
  } = useSuspenseQuery(FetchGoalsByDivision);

  const [transformedData] = useState(() => goalsByDivisionTransform(games));

  return (
    <LinePlot
      data={transformedData}
      plotOptions={plotOptions}
      lineOptions={lineOptions}
    />
  );
};

export default React.memo(GoalsByDivision);
