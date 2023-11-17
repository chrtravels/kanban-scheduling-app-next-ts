'use client'

import styles from './taskCards.module.scss'

import EditTask from '../editTask/EditTask';

export default function TaskCards(props: { tasks: [{title: string, status: string, subtasks: [], description: string}] }) {
  const tasks = props.tasks;

  return (
    <div className={styles.container}>
      {tasks.map((task) => {
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
            {/* <EditTask task={task} tasksCompleted={tasksCompleted()} /> */}
            <div className={`card ${styles.cardContainer}`}>
              <span>{task.title}</span>
              <span className={styles.subtasks}>{tasksCompleted()} of {task.subtasks.length} subtasks</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
