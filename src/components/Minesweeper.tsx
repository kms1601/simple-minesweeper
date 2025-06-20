import type {ReactNode} from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import MsCell from "./MsCell.tsx";
import shuffle from "../utils/shuffle.ts";
import styled from "styled-components";
import Remain from "./Remain.tsx";

interface msData {
  h: number;
  w: number;
  mines: number;
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Table = styled.table`
  border-collapse: collapse;
  border-style: solid;
`;

const EndWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(228, 228, 228, 0.7);
`;

const End = styled.p`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ResetBtn = styled.button`
  margin-top: 20px;
  border: none;
  padding: 10px 30px 10px 30px;
  border-radius: 5px;
  background: #eaeaea;

  &:hover {
    background: #d3d3d3;
  }

  &:active {
    background: #b8b8b8;
  }
`;

const NumWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const NumLabel = styled.span`

`;

const NumInput = styled.input`

`;

const Minesweeper = () => {
  const [msData, setMsData] = useState<msData>({h: 9, w: 9, mines: 10});
  const [grid, setGrid] = useState<number[][]>([]);
  const [state, setState] = useState<number[][]>([]);
  const [placed, setPlaced] = useState<boolean>(false);
  const [end, setEnd] = useState<number>(0);
  const [remain, setRemain] = useState<number>(msData.mines);
  const [count, setCount] = useState<number>(0);
  const [notice, setNotice] = useState<boolean>(false);
  const [maxMines, setMaxMines] = useState<number>(msData.h * msData.w - 1);

  const height = useRef<HTMLInputElement>(null);
  const width = useRef<HTMLInputElement>(null);
  const minesCount = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initMs();
  }, [msData]);

  useEffect(() => {
    if (count === msData.h * msData.w && remain === 0 && end === 0) {
      gameClear();
    }
  }, [remain, count]);

  const initMs = () => {
    // 초기화
    setRemain(msData.mines);
    setCount(0);

    // 2차원 배열 생성
    const newGrid = Array.from({length: msData.h}, () => Array.from({length: msData.w}, () => 0))
    const newState = Array.from({length: msData.h}, () => Array.from({length: msData.w}, () => 0))
    setGrid([...newGrid]);
    setState([...newState]);
    setPlaced(false);
    setEnd(0);
  };

  const placeMines = (openH: number, openW: number) => {
    const pos = Array.from({length: msData.w * msData.h}, (_, i) => i);
    pos.splice(openH * msData.w + openW, 1);
    shuffle(pos);

    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
    pos.slice(0, msData.mines).forEach((p) => {
      const r = Math.floor(p / msData.w);
      const c = p % msData.w;
      // 지뢰 설치
      grid[r][c] = -1;

      // 힌트 숫자 설정
      for (let i = 0; i < 8; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        if (0 <= nr && nr < msData.h && 0 <= nc && nc < msData.w && grid[nr][nc] >= 0) {
          grid[nr][nc] += -grid[r][c];
        }
      }
    });
    setGrid([...grid]);
  };

  const clickCell = useCallback((r: number, c: number) => {
    // 초기 지뢰 배치(이후로는 실행 안함)
    if (!placed) {
      placeMines(r, c);
      setPlaced(prev => !prev);
    }

    if (state[r][c] != 0) return;
    if (grid[r][c] < 0) {
      gameOver();
      return;
    }

    // bfs(빈칸 연쇄적으로 열기)
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
    const queue: number[][] = [];
    queue.push([r, c]);
    state[r][c] = 3;
    setCount(prev => prev + 1);
    while (queue.length) {
      const cur = queue.shift();
      if (!cur) break;
      const r = cur[0];
      const c = cur[1];
      if (grid[r][c] !== 0) continue;
      for (let i = 0; i < 8; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        if (0 <= nr && nr < msData.h && 0 <= nc && nc < msData.w && !state[nr][nc]) {
          setCount(prev => prev + 1);
          queue.push([nr, nc]);
          state[nr][nc] = 3;
        }
      }
    }

    // 결과 반영
    setState([...state]);
  }, [grid, state, placed]);

  const rightClickCell = useCallback((r: number, c: number) => {
    switch (state[r][c]) {
      case 3:
        return;
      case 0:
        state[r][c] = 1;
        setRemain(prev => prev - 1);
        setCount(prev => prev + 1);
        break;
      case 1:
        state[r][c] = 2;
        setRemain(prev => prev + 1);
        setCount(prev => prev - 1);
        break;
      case 2:
        state[r][c] = 0;
    }
    setState([...state]);
  }, [remain, count, state])

  const gameOver = () => {
    setEnd(2);
    grid.map((row, r) => {
      row.map((col, c) => {
        if (col < 0) {
          state[r][c] = 4;
        } else {
          state[r][c] = 3;
        }
      });
    });
    setState([...state]);
  };

  const gameClear = () => {
    setEnd(1);
  };

  const reset = () => {
    if (!height.current || !width.current || !minesCount.current) {
      return;
    }
    if (+height.current.value < 1) {
      height.current.value = "9";
    }
    if (+width.current.value < 1) {
      width.current.value = "9";
    }
    if (+minesCount.current.value < 0) {
      minesCount.current.value = "10";
    }

    const nh = +height.current.value;
    const nw = +width.current.value;
    const nm = +minesCount.current.value;
    if (nh * nw <= nm) {
      setMaxMines(nh * nw - 1);
      setNotice(true);
      return;
    }
    setNotice(false);
    setEnd(3);
    setMsData({
        h: nh,
        w: nw,
        mines: nm,
      }
    );
  };

  return (
    <>
      <Wrapper>
        <Table>
          <tbody>
          {
            grid.map((row, r) =>
              <tr key={r + "r"}>
                {
                  row.map((col, c) =>
                    <MsCell
                      key={c + "c"}
                      cell={col}
                      state={state[r][c]}
                      onClick={() => {
                        clickCell(r, c);
                      }}
                      onRightClick={(e) => {
                        e.preventDefault();
                        rightClickCell(r, c);
                      }}
                    />
                  )
                }
              </tr>
            )
          }
          </tbody>
        </Table>
        {
          (end === 1 ? <EndWrapper><End>Clear!</End></EndWrapper> : null) as ReactNode
        }
        {
          (end === 2 ? <EndWrapper><End>Game Over!</End></EndWrapper> : null) as ReactNode
        }
      </Wrapper>
      <Remain mines={msData.mines} remain={remain}/>
      <NumWrapper>
        <NumLabel>Height</NumLabel>
        <NumInput ref={height} defaultValue={9}/>
      </NumWrapper>
      <NumWrapper>
        <NumLabel>Width</NumLabel>
        <NumInput ref={width} defaultValue={9}/>
      </NumWrapper>
      <NumWrapper>
        <NumLabel>Mines</NumLabel>
        <NumInput ref={minesCount} defaultValue={10}/>
      </NumWrapper>
      <ResetBtn onClick={reset}>reset</ResetBtn>
      {
        notice ? <p style={{color: "red"}}> Too many mines! Max: {maxMines} </p> : <></>
      }
    </>
  )
}

export default Minesweeper;