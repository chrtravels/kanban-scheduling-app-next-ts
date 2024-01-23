"use client"

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';


export default function SidebarLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [boards, setBoards] = useState([]);

  const [boardNames, setBoardNames] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(boardNames[0]);

  useMemo(() => {
    if (boardNames.length > 0) {
      if (!currentBoard) setCurrentBoard(boardNames[0]);
    }
  }, [boardNames])

  useEffect(() => {
    const controller = new AbortController;

    const fetchData = async () => {
      const res = await fetch('/api/boards', {
        signal: controller.signal
      });

      const data = await res.json();
      setBoards(data);

      return () => controller.abort();
    }
    fetchData()
  }, [currentBoard])


  useMemo(() => {
    const boardList = [];
    const statusTypes = [];

    if (boards.length > 0) {
      boards.forEach((el, idx) => {
        if (!boardList.includes(el.board_name)) {
          boardList.push(el.board_name)
        }

        if (currentBoard === el.board_name) {
          statusTypes.push(...el.columns.map((column) => {
            return column.name;
          }));
        }
      })
    }
    setBoardNames([...boardList])
    setStatusList([...statusTypes])
  }, [boards, currentBoard])


  // Changes the content container left margin to move with the side bar
  const contentStyle = {
    marginLeft: sidebarExpanded ? "270px" : "0px",
    transition: "all 0.5s ease-in-out",
};

  return (
    <>
      <Navbar
      sidebarExpanded={sidebarExpanded}
      currentBoard={currentBoard}
      setCurrentBoard={setCurrentBoard}
      statusList={statusList}
      boards={boards}
      />

      <Sidebar
      boardNames={boardNames}
      sidebarExpanded={sidebarExpanded}
      setSidebarExpanded={setSidebarExpanded}
      currentBoard={currentBoard}
      setCurrentBoard={setCurrentBoard} />

      <main className='layout-content' style={contentStyle}>
        { children }
      </main>
    </>
  )
}
