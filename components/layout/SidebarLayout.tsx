"use client"

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

type Board = {
  id: number,
  board_name: string,
  status: string,
  tasks: []
}

type StringArray = string[]


export default function SidebarLayout({ children,
}: {
  children: React.ReactNode
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [boards, setBoards] = useState([]);
  const [boardNames, setBoardNames] = useState<StringArray>([]);
  const [boardCount, setBoardCount] = useState(0)
  const [statusList, setStatusList] = useState([]);
  const [currentBoard, setCurrentBoard] = useState<string>(boardNames[0]);

  useEffect(() => {
    if (boardNames.length > 0) {
      if (!currentBoard) setCurrentBoard(boardNames[0]);
    }
  }, [boardNames])

  console.log()
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/boards');

      const data = await res.json();
      setBoards(data);
      return Response.json(data);
    }
    fetchData()
  }, [])

  useEffect(() => {
    const boardList: Array<string> = [];
    const statusTypes = [];
    let count = 0;

    if (boards.length > 0) {
      boards.forEach((el: Board) => {
        count++;
        if (!boardList.includes(el.board_name)) {
          boardList.push(el.board_name)
        }
        if (currentBoard === el.board_name && !statusTypes.includes(el.status)) {
          statusTypes.push(el.status);
        }
      })
    }
    setBoardCount(count);
    setBoardNames([...boardList])
    setStatusList([...statusTypes])
  }, [boards, currentBoard])

  // Changes the content container left margin to move with the side bar
  const contentStyle = {
    marginLeft: sidebarExpanded ? "270px" : "0px",
    transition: "all 0.5s ease-in-out",
    // transition: "margin 0.2s ease"
};

  return (
    <>
      <Navbar
      sidebarExpanded={sidebarExpanded}
      currentBoard={currentBoard}
      setCurrentBoard={setCurrentBoard}
      statusList={statusList}
      />

      <Sidebar
      boardNames={boardNames}
      boardCount={boardCount}
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
