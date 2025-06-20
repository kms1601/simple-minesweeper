import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styled from "styled-components";

const Div = styled.div`
  margin-top: 25px;
  text-align: center;
  font-size: 25px;
  box-sizing: content-box;

  svg {
    cursor: pointer;

    path {
      fill: #878787;
    }

    &:hover path {
      fill: #5c5c5c;
    }

    &:active path {
      fill: #424242;
    }
  }
`

const Github = () => {
  return (
    <Div>
      <a href={"https://github.com/kms1601/simple-minesweeper"}><FontAwesomeIcon icon={faGithub}/></a>
    </Div>
  );
};

export default Github;