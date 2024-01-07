"use client"

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

type Board = {
  id: number,
  board_name: string,
  status: string,
  tasks: [{
    title: string,
    status: string,
    subtasks: [{
      title: string,
      isCompleted: boolean
    }] | [],
    description: string
  }]
}

type StringArray = string[]


export default function SidebarLayout({ children,
}: {
  children: React.ReactNode
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [boards, setBoards] = useState([]);
  const [boardNames, setBoardNames] = useState<StringArray>([]);
  const [statusList, setStatusList] = useState([]);
  const [currentBoard, setCurrentBoard] = useState<string>(boardNames[0]);

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
    const boardList: Array<string> = [];
    const statusTypes: Array<string> = [];

    if (boards.length > 0) {
      boards.forEach((el: Board, idx) => {
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
