'use client'

import Image from 'next/image';
import styles from './editTask.module.scss'

type Params = {
  task: {
    title: string,
    status: string,
    subtasks: Array<string>,
    description: string
  },
  tasksCompleted: () => any
}

export default function EditTask(props: Params) {
  const task = props.task;

  return (
    <div className={styles.container}>
      <div className={`card ${styles.editContainer}`}>
        <div className={styles.header}>
          <h3>{task.title}</h3>
          <Image
          src='/assets/icon-vertical-ellipsis.svg'
          height={20}
          width={5}
          alt='edit button'
          />
        </div>

        <p className='body-l'>{task.description}</p>
        <span className='heading-s'>Subtasks ({props.tasksCompleted} of {task.subtasks.length})</span>

        <div className={styles.subtasks}>
          {task.subtasks.map((subtask) => {
            return <div className={`subtask body-l ${styles.task}`}>{subtask.title}</div>
          })}
        </div>
        <div className={styles.status}>
          <span className='body-l'>Current Status</span>
        </div>
      </div>
    </div>
  )
}
