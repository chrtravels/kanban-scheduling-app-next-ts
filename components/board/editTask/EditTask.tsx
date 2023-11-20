'use client'

import Image from 'next/image';
import { useState } from 'react';
import styles from './editTask.module.scss'
import DropdownList from '../../dropownList/DropdownList';


type Params = {
  task: {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  },
  statusTypes: string[]
}

export default function EditTask(props: Params) {
  const task = props.task;
  const [selectedOption, setSelectedOption] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);

  type TaskState = {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  }

  const [taskState, setTaskState] = useState<TaskState>({
    title: task.title,
    status: task.status,
    subtasks: task.subtasks,
    description: task.title
  })

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

  type Options = () => [{}]

  console.log(subtasks)

  function handleChange (e, position) {
    // Update subTasks completed status
      setSubtasks((subtasks) => ([
        ...subtasks, subtasks[position]
      ]))

        // setSubtasks((subtasks) => setSubtasks([
        //   ...subtasks, subtasks[idx]
        //   ]))
  }

  // const options: Options = () => {
  //   let list: [{label?: string, value?: string}] = [{}]

  //    props.statusTypes.forEach((status) => {
  //     if (Object.keys(list[0]).length === 0) {
  //       list = [{label: status, value: status}]
  //     } else {
  //       list.push(
  //         {
  //           label: status,
  //           value: status,
  //         }
  //       )
  //     }
  //   })
  //   return list;
  // }

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
        <span className='heading-s subtask-header'>Subtasks ({tasksCompleted()} of {task.subtasks.length})</span>

        <div className={styles.subtasks}>
          {task.subtasks.map((subtask, idx) => {
            return (
              <div className={`subtask body-l ${styles.task}`}>
                <input
                className={`checkbox`}
                id={subtask.title}
                type="checkbox"
                value="you"
                checked={subtasks[idx].isCompleted}
                onChange={(e) => {
                  // handleSelected(e, index)
                  handleChange(e, idx)

                  // setSubtasks((subtasks) => ([
                  // ...subtasks, subtasks[idx]
                  // ]))
                }}
                />
                {subtask.title}
                </div>
            )
          })}
        </div>

        <div className={styles.status}>
          <span className='body-l'>Current Status</span>
          <select
          id='currentStatus'
          name='currentStatus'
          className='nativeSelect'
          aria-labelledby='currentStatusLabel'
          value={taskState.status}
          onChange={(e) => setTaskState((taskState) => ({
              ...taskState, [e.target.id]: e.target.value
            }))}>
            {props.statusTypes.map((option) => {
              return <option value={option}>{option}</option>
            })}
          </select>

          <DropdownList
          options={props.statusTypes}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          currentFieldName='Current Status'
          state={taskState}
          setState={setTaskState}
          />
        </div>
      </div>
    </div>
  )
}
