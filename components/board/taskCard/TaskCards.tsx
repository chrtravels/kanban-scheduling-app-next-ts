'use client'

import styles from './taskCards.module.scss'

import { useState } from 'react';
import EditTask from '../editTask/EditTask';


type Props = {
  tasks: [{
    title: string,
    status: string,
    subtasks: [],
    description: string,
  }],
  statusTypes: string[]
  // taskIndex: number,
  // setClickedTask: {},
}

export default function TaskCards(props: Props) {
  const tasks = props.tasks;

  const [clickedTask, setClickedTask] = useState(tasks[0])
  const [showEditTask, setShowEditTask] = useState(false);

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
            {showEditTask &&
            <EditTask
            task={clickedTask}
            statusTypes={props.statusTypes}
            setShowEditTask={setShowEditTask}
            />}
            <div className={`card ${styles.cardContainer}`} onClick={() => {
              setClickedTask(task)
              setShowEditTask(true)
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
