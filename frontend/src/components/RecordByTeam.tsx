import { useSuspenseQuery } from "@apollo/client";
import { FetchTeamRecords, FetchTeamRecordsResp } from "../queries";
import React, { useState } from "react";
import BarPlot from "./BasePlots/BarPlot";
import { PlotOptions } from "@observablehq/plot";
import { recordByTeamTransform } from "../utils/transforms";

const barOptions = {
  y: "count",
  x: "type",
  fill: "type",
  fx: "name",
};

const RecordByTeam = () => {
  const {
    data: { teams },
  } = useSuspenseQuery<FetchTeamRecordsResp>(FetchTeamRecords);

  const [{ transformedData, teamOrder }] = useState(() =>
    recordByTeamTransform(teams)
  );

  const [plotOptions] = useState<PlotOptions>({
    x: { axis: null },
    y: { grid: true, label: null },
    fx: { label: null, domain: teamOrder },
    color: { legend: true },
  });

  return (
    <BarPlot
      data={transformedData}
      barOptions={barOptions}
      plotOptions={plotOptions}
    />
  );
};

export default React.memo(RecordByTeam);
