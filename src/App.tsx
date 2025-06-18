import Minesweeper from "./components/Minesweeper.tsx";
import styled from "styled-components";

const Body = styled.div`
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const App = () => {
  return (
    <Body>
      <h1 style={{width: "100%", textAlign: "center"}}>Simple Minesweeper</h1>
      <Minesweeper/>
    </Body>
  );
};

export default App;