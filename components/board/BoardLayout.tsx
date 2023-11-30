'use client'

import { useState, useEffect } from 'react';
import styles from './boardLayout.module.scss'
import NewColumn from './newColumn/NewColumn';
import TaskCards from './taskCard/TaskCards';

type Params = {
  boards: {[key: string]: [
    {db_id: number, status: 'string', tasks: []}
  ]},
  UrlBoardName: string,
}

type StatusTypes = string[]

export default function BoardLayout (props: Params) {
  const { boards, UrlBoardName } = props;

  const currentBoardName = UrlBoardName.includes('-') ? UrlBoardName.split('-').join(' ') : UrlBoardName;
  const selectedBoard = boards.filter((board) => {
    return board.board_name == currentBoardName;
  })

  // Get the status options for the drop Edit task component drop down list
  const [statusTypes, setStatusTypes] = useState<StatusTypes>(selectedBoard[0].columns.map((board) => {
    return board.name;
  }));


  const bulletColorArray = [
    '#49c4e5',
    '#8471f2',
    '#67e2ae'
  ]


  return (
    <div className={styles.container}>

     {selectedBoard[0].columns.map((column, idx) => {
        return (
          <div key={column.name} className={styles.column}>
            <div className={styles.columnHeader}>
              {idx <= bulletColorArray.length - 1 &&
                <div className={styles.bullet} style={{backgroundColor: bulletColorArray[idx]}}></div>
              }
              <div className={styles.title}>{column.name.toUpperCase()} <span>({column.tasks.length})</span></div>
            </div>

            <div className={styles.columnBody}>
              <div key={`${column.status}-${idx}`}>
                <TaskCards databaseId={selectedBoard[0].id} boardName={currentBoardName} boardStatus={column.name} tasks={column.tasks} statusTypes={statusTypes} />
              </div>

            </div>
          </div>
        )
      })}

      <NewColumn />
    </div>
  )
}
