'use client'

import styles from './taskCards.module.scss'

import { useState } from 'react';
import EditTask from '../editTask/EditTask';
import ViewTask from '../viewTask/ViewTask';


type Props = {
  databaseId: number,
  boardName: string,
  boardStatus: string,
  tasks: [{
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string,
  }],
  statusTypes: string[]
}

export default function TaskCards(props: Props) {
  const { databaseId, boardName, boardStatus, tasks, statusTypes } = props;

  const [clickedTask, setClickedTask] = useState(tasks[0])
  const [clickedId, setClickedId] = useState(0)
  const [showEditTask, setShowEditTask] = useState(false);
  const [showTask, setShowTask] = useState(false);

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
            databaseId={databaseId}
            boardStatus={boardStatus}
            boardName={boardName}
            tasks={tasks}
            task={clickedTask}
            taskId={clickedId}
            statusTypes={statusTypes}
            setShowTask={setShowTask}
            />}

            <div className={`card ${styles.cardContainer}`} onClick={() => {
              setClickedTask(task)
              setClickedId(idx)
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
