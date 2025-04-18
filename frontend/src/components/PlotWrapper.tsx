import React, { FC, PropsWithChildren, Suspense } from "react";
import styled from "styled-components";
import Loading from "./Loading";

type PlotWrapperProps = PropsWithChildren<{
  title: string;
}>;

const PlotWrapper: FC<PlotWrapperProps> = ({ children, title }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </Wrapper>
);

const Title = styled.h2``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  max-width: 600px;
  min-height: 400px;

  figure {
    margin: 0;
  }
`;

export default React.memo(PlotWrapper);
