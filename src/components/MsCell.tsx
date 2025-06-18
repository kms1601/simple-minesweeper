import styled from "styled-components";
import type {MouseEventHandler} from "react";
import {useEffect, useState} from "react";

const P = styled.p`
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  box-sizing: content-box;
  text-align: center;
  line-height: 21px;
  user-select: none;
`;

const Td = styled.td<{ $state: number }>`
  width: 19px;
  height: 19px;
  padding: 0;
  border: 0.5px solid black;
  background: ${({ $state }) => $state === 3 ? "#cdcdcd" : $state === 4 ? "#e62626" : "white"};

  &:hover {
    background: ${({$state}) => ($state === 3 ? "#cdcdcd" : "#e8e8e8")};
  }

  &:active {
    background: #cdcdcd;
  }
`;

const MsCell = (props: {
  cell: number,
  state: number,
  onClick: MouseEventHandler,
  onRightClick: MouseEventHandler,
}) => {
  const [text, setText] = useState<string>(" ");

  useEffect(() => {
    switch (props.state) {
      case 0:
        setText(" ");
        break;
      case 1:
        setText("✱");
        break;
      case 2:
        setText("?");
        break;
      // case 3
      default:
        switch (props.cell) {
          case -1:
            setText("✱");
            break;
          case 0:
            break;
          default:
            setText(props.cell.toString());
        }
        break;
    }
  }, [props.cell, props.state]);

  return (
      <Td
          onClick={props.onClick}
          onContextMenu={props.onRightClick}
          $state={props.state}
      >
        <P>{text}</P>
      </Td>
  );
};

export default MsCell;