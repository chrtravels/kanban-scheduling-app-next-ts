"use client"

import { useEffect, useState } from 'react';
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
  const [sidebarExpanded, setSidebarExpanded] = useState<Boolean>(false);
  const [boards, setBoards] = useState([]);
  const [boardNames, setBoardNames] = useState<StringArray>([]);
  const [boardCount, setBoardCount] = useState(0)

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
    let count = 0;

    if (boards.length > 0) {
      boards.forEach((el: Board) => {
        count++;
        if (!boardList.includes(el.board_name)) {
          boardList.push(el.board_name)
        }
      })
    }
    setBoardCount(count);
    setBoardNames([...boardList])

  }, boards)

  // Changes the content container left margin to move with the side bar
  const contentStyle = {
    marginLeft: sidebarExpanded ? "270px" : "0px",
    transition: "all 0.5s ease-in-out",
    // transition: "margin 0.2s ease"
};

  return (
    <>
      <Navbar sidebarExpanded={sidebarExpanded} />
      <Sidebar boardNames={boardNames} boardCount={boardCount} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
      <div className='layout-content' style={contentStyle}>
      { children }
      </div>
    </>
  )
}

// async function getData() {
//   const res = await fetch('/api/boards');

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   return res.json();
// }
