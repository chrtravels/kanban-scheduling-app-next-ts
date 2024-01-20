'use client'

import styles from './taskCards.module.scss'

import { useState } from 'react';
import ViewTask from '../viewTask/ViewTask';

export default function TaskCards(props) {
  const { boardName, boardStatus, tasks, statusTypes, setColumnStatus, setShowDeleteTask, clickedId, setClickedId } = props;

  const [clickedTask, setClickedTask] = useState(tasks[0])
  const [showTask, setShowTask] = useState(false);

  return (
    <div className={styles.container}>
      {tasks.map((task, idx) => {
        // Get the number of subtasks completed
        const tasksCompleted = () => {
          let numCompleted= 0;

          task.subtasks.forEach((subtask) => {
            if (subtask.isCompleted) {
              numCompleted++;
            }
          })

          return numCompleted;
        }

        return (
          <div key={task.title}>
            {showTask &&
              <ViewTask
              boardStatus={boardStatus}
              boardName={boardName}
              tasks={tasks}
              task={clickedTask}
              taskId={clickedId}
              statusTypes={statusTypes}
              setShowTask={setShowTask}
              setShowDeleteTask={setShowDeleteTask}
              />
            }

            <div className={`card ${styles.cardContainer}`} onClick={() => {
              setClickedTask(task)
              setClickedId(idx)
              setColumnStatus(boardStatus)
              setShowTask(true)
            }}>
              <span>{task.title}</span>
              <span className={styles.subtasks}>{tasksCompleted()} of {task.subtasks.length} subtasks</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
