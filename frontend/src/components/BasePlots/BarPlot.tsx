import {
  plot as Plot,
  barY,
  BarYOptions,
  PlotOptions,
} from "@observablehq/plot";
import React, { useEffect } from "react";
import { FC, useRef } from "react";

type BarPlotParams<T extends Array<unknown> = Array<unknown>> = {
  data: T;
  barOptions?: BarYOptions;
  plotOptions?: Omit<PlotOptions, "marks">;
};

const BarPlot: FC<BarPlotParams> = ({ data, barOptions, plotOptions }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const plot = Plot({
      style: {
        fontSize: "12",
        backgroundColor: "#534d4d",
      },
      ...plotOptions,
      marks: [barY(data, barOptions)],
    });

    ref.current.append(plot);

    return () => plot.remove();
  });

  return <div ref={ref} />;
};

export default React.memo(BarPlot);
