'use client'

import styles from './taskCards.module.scss'

export default function TaskCards(props: { tasks: [{title: string, status: string, subtasks: [], description: string}] }) {
  const tasks = props.tasks;
  // console.log('tasks: ', tasks)

  return (
    <div className={styles.container}>
      {tasks.map((task, idx) => {
        return (
          <div className={`task-card ${styles.cardContainer}`}>
            <span>{task.title}</span>
            <span className={styles.subtasks}>0 of {task.subtasks.length} subtasks</span>
          </div>
        )
      })}
    </div>
  )
}
