'use client'

import { useState, useEffect } from 'react';
import styles from './boardLayout.module.scss'
import NewColumn from './newColumn/NewColumn';
import TaskCards from './taskCard/TaskCards';

type Params = {
  boards: {[key: string]: [
    {db_id: number, status: 'string', tasks: []}
  ]},
  boardName: string,
}

type StatusTypes = string[]

export default function BoardLayout (props: Params) {
  const { boards, boardName } = props;

  const currentBoardName = boardName.includes('-') ? boardName.split('-').join(' ') : boardName;
  const selectedBoard = boards[currentBoardName]
  // Collect the data for the clicked task card
  const [clickedTask, setClickedTask] = useState({})
  const [showEditTask, setShowEditTask] = useState(false);
  // Get the status options for the drop Edit task component drop down list
  const [statusTypes, setStatusTypes] = useState<StatusTypes>([]);

  useEffect(() => {
    setShowEditTask(true);
  }, setClickedTask)

  const bulletColorArray = [
    '#49c4e5',
    '#8471f2',
    '#67e2ae'
  ]

  function handleTaskClick(task: {}) {
    setClickedTask(task)

    // update the task in database entry where board_name = props.boardName && status = category.status
  }

  return (
    <div className={styles.container}>
      {selectedBoard.map((category, idx) => {
        if (category.tasks.length > 0) {
          if (!statusTypes.includes(category.status)) {
            setStatusTypes([...statusTypes, category.status])
          }

          return (
            <div key={category.status} className={styles.column}>
              <div className={styles.columnHeader}>
                {idx <= bulletColorArray.length - 1 &&
                  <div className={styles.bullet} style={{backgroundColor: bulletColorArray[idx]}}></div>
                }
                <div className={styles.title}>{category.status.toUpperCase()} <span>({category.tasks.length})</span></div>
              </div>

              <div className={styles.columnBody}>
                {selectedBoard.map((column, idx) => {
                  if (category.status === column.status) {
                    const tasks: [{title: string, status: string, subtasks: [], description: string}] = column.tasks;
                    return (
                      <div key={`${column.status}-${idx}`}>
                        <TaskCards databaseId={column.db_id} boardName={currentBoardName} boardStatus={column.status} tasks={tasks} statusTypes={statusTypes} />
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        } else return;
      })}
      <NewColumn />
    </div>
  )
}
