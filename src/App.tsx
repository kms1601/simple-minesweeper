import Minesweeper from "./components/Minesweeper.tsx";
import styled from "styled-components";
import Github from "./components/Github.tsx";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const Section = styled.section`
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  gap: 10px;
`;

const Footer = styled.footer`
  height: 50px;
  padding-bottom: 15px;
`;

const App = () => {
  return (
    <Wrapper>
      <Section>
        <h1 style={{width: "100%", textAlign: "center"}}>Simple Minesweeper</h1>
        <Minesweeper/>
      </Section>
      <Footer>
        <Github/>
      </Footer>
    </Wrapper>
  );
};

export default App;