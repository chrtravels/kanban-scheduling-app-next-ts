"use client"

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import Navbar from '../ui/navbar/Navbar';
import Sidebar from '../ui/sidebar/Sidebar';



export default function SidebarLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [boards, setBoards] = useState([]);

  const [boardNames, setBoardNames] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(boardNames[0]);
  const pathname = usePathname().slice(1)


  useEffect(() => {
    if (boardNames.length > 0) {
      if (pathname.length > 0) {
        setCurrentBoard(pathname.split('-').join(' '))
      } else if (!currentBoard) setCurrentBoard(boardNames[0]);
    }
  }, [pathname, boardNames])

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


  useEffect(() => {
    const boardList = [];
    const statusTypes = [];

    if (boards.length > 0) {
      boards.forEach((el) => {
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
