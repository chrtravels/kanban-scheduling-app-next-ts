'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './boardLayout.module.scss'
import NewColumn from './newColumn/NewColumn';
import TaskCards from './taskCard/TaskCards';
import DeleteTask from './deleteTask/DeleteTask';

interface Params {
  boards: {[key: string]: [
    {id: number, board_name: string, columns: [{}]}
  ]},
  UrlBoardName: string,
}

interface Board {
  id: number,
  board_name: string,
  columns: [{}]
}

type StatusTypes = string[]

interface Column {
  name: string,
  tasks: [{title: string, status: string, subtasks:[{title: string, isCompleted: boolean}], description: string}]
}

export default function BoardLayout (props: Params) {
  const { boards, UrlBoardName } = props;

  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [columnStatus, setColumnStatus] = useState('');
  const [clickedId, setClickedId] = useState(0);

  const router = useRouter();

  const currentBoardName = UrlBoardName.includes('-') ? UrlBoardName.split('-').join(' ') : UrlBoardName;

  //return the board in the URL
  const tempBoard = (boards as any).filter((board: Board) => {
    return board.board_name == currentBoardName || board.board_name === UrlBoardName;
  })
  // redirect back to the first board if the board in the URL does not exist
  if (tempBoard.length === 0) router.push(`/${boards[0].board_name.split(' ').join('-')}`)

  const selectedBoard = tempBoard.length > 0 ? [...tempBoard] : [boards[0]];

  const currentBoard = (boards as any).filter((board: Board) => {
    return board.board_name === currentBoardName
  })[0]
  // Get the status options for the drop Edit task component drop down list
  const [statusTypes, setStatusTypes] = useState<StatusTypes>(selectedBoard[0].columns.map((column: Column) => {
    return column.name;
  }));

  const bulletColorArray = [
    '#49c4e5',
    '#8471f2',
    '#67e2ae',
    '#b30687',
    '#7c91f9',
    '#fecc1c',
    '#f98d3e',
  ]

  // Removes scrollbar when modal open
useEffect(() => {
  if (showDeleteTask) {
    document.body.classList.add("overflow-y-hidden")
  } else {
    document.body.classList.remove("overflow-y-hidden")
  }
}, [showDeleteTask])

  return (
    <div className={styles.container}>
      {showDeleteTask &&
        <DeleteTask boardName={currentBoardName} columnName={columnStatus} taskId={clickedId} setShowDeleteTask={setShowDeleteTask} />
      }

     {selectedBoard[0].columns.map((column: Column, idx: number) => {
        return (
          <div key={column.name} className={styles.column}>
            <div className={styles.columnHeader}>
              {idx <= bulletColorArray.length - 1 &&
                <div className={styles.bullet} style={{backgroundColor: bulletColorArray[idx]}}></div>
              }
              <div className={styles.title}>{column.name.toUpperCase()} <span>({column.tasks.length})</span></div>
            </div>

            <div className={styles.columnBody}>
              <div key={`${column.name}-${idx}`}>
                <TaskCards boardName={currentBoardName} boardStatus={column.name} tasks={column.tasks} statusTypes={statusTypes} setColumnStatus={setColumnStatus} clickedId={clickedId} setClickedId={setClickedId} setShowDeleteTask={setShowDeleteTask} />
              </div>

            </div>
          </div>
        )
      })}

      <NewColumn boardName={currentBoardName} currentBoard={currentBoard} />
    </div>
  )
}
