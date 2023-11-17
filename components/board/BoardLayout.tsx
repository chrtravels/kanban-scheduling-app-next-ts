'use client'

import styles from './boardLayout.module.scss'

import TaskCards from './boardCard/TaskCards';


export default function BoardLayout (props: { boards: {[key: string]: any[]}, boardName: string}) {
  const currentBoardName = props.boardName.includes('-') ? props.boardName.split('-').join(' ') : props.boardName;
  const selectedBoard = props.boards[currentBoardName]

  const bulletColorArray = [
    '#49c4e5',
    '#8471f2',
    '#67e2ae'
  ]

  return (
    <div className={styles.container}>
      {selectedBoard.map((column, idx) => {

        return (
          <div key={idx} className={styles.column}>
            <div className={styles.columnHeader}>
              {idx <= bulletColorArray.length - 1 &&
                <div className={styles.bullet} style={{backgroundColor: bulletColorArray[idx]}}></div>
              }
              <div className={styles.title}>{column.status.toUpperCase()} <span>({column.tasks.length})</span></div>
            </div>

            <div className={styles.columnBody}>
              {selectedBoard.map((board, idx) => {

                if (column.status === board.status) {
                  const tasks: [{title: string, status: string, subtasks: [], description: string}] = board.tasks;

                  return (
                    <TaskCards tasks={tasks} />
                  )
                }
              })}
            </div>
          </div>
        )
      })}

    </div>
  )
}
