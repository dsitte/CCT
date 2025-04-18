import {
  LineYOptions,
  plot as Plot,
  PlotOptions,
  lineY,
} from "@observablehq/plot";
import React, { useEffect } from "react";
import { FC, useRef } from "react";

type LinePlotParams<T extends Array<unknown> = Array<unknown>> = {
  data: T;
  lineOptions?: LineYOptions;
  plotOptions?: Omit<PlotOptions, "marks">;
};

const LinePlot: FC<LinePlotParams> = ({ data, plotOptions, lineOptions }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const plot = Plot({
      style: {
        fontSize: "12",
        backgroundColor: "#534d4d",
        padding: "8px",
      },
      ...plotOptions,
      marks: [lineY(data, lineOptions)],
    });

    ref.current.append(plot);

    return () => plot.remove();
  });

  return <div ref={ref} />;
};

export default React.memo(LinePlot);
