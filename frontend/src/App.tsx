import RecordByTeam from "./components/RecordByTeam";
import AttendanceByWeather from "./components/AttendanceByWeather";
import AttendanceByDate from "./components/AttendanceByDate";
import AttendanceByDivision from "./components/AttendanceByDivision";
import GoalsByDivision from "./components/GoalsByDivision";
import styled from "styled-components";
import PlotWrapper from "./components/PlotWrapper";

const App = () => {
  return (
    <AppWrapper>
      <h1>Soccer Stats</h1>
      <PlotRow>
        <PlotWrapper title="Team Records">
          <RecordByTeam />
        </PlotWrapper>

        <PlotWrapper title="Attendance by Weather">
          <AttendanceByWeather />
        </PlotWrapper>

        <PlotWrapper title="Total Attendance">
          <AttendanceByDate />
        </PlotWrapper>

        <PlotWrapper title="Attendance by Division">
          <AttendanceByDivision />
        </PlotWrapper>

        <PlotWrapper title="Goals by Division">
          <GoalsByDivision />
        </PlotWrapper>
      </PlotRow>
    </AppWrapper>
  );
};

const PlotRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: top;
  flex-wrap: wrap;
`;

const AppWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

export default App;
