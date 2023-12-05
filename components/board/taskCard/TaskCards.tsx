'use client'

import styles from './taskCards.module.scss'

import { useState } from 'react';
import ViewTask from '../viewTask/ViewTask';


type Props = {
  boardName: string,
  boardStatus: string,
  tasks: [{
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string,
  }],
  statusTypes: string[],
  setColumnStatus: React.Dispatch<React.SetStateAction<string>>,
  setShowDeleteTask: React.Dispatch<React.SetStateAction<boolean>>,
  clickedId: number,
  setClickedId: React.Dispatch<React.SetStateAction<number>>,
}

export default function TaskCards(props: Props) {
  const { boardName, boardStatus, tasks, statusTypes, setColumnStatus, setShowDeleteTask, clickedId, setClickedId } = props;

  const [clickedTask, setClickedTask] = useState(tasks[0])
  // const [clickedId, setClickedId] = useState(0)
  const [showTask, setShowTask] = useState(false);
  // const [showDeleteTask, setShowDeleteTask] = useState(false);

  return (
    <div className={styles.container}>
      {tasks.map((task, idx) => {
        // Get the number of subtasks completed
        type TasksCompleted = () => number;

        const tasksCompleted: TasksCompleted = () => {
          let numCompleted= 0;

          task.subtasks.forEach((subtask: {title: string, isCompleted: boolean}) => {
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
