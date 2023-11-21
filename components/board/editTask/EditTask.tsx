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

        console.log('subtasks: ', subtasks)
  // Setup array to contain the state of the "you" column check boxes
  const [subtasksChecked, setSubtasksChecked] = useState(
    subtasks.map((subtask) => {
      return subtask.isCompleted
    })
  );


  function handleSelected (e, position) {
    // Handle the checkbox state changes for "you" column
      const updatedSubtasksChecked = subtasksChecked.map((checked, index) => {
        return index === position ? !checked : checked
      });
      setSubtasksChecked(updatedSubtasksChecked);
  }

  function handleChange (e, position) {
    const subTasksCopy = [...subtasks];

    subTasksCopy[position] = subtasks[position].isCompleted ?
    {'title': subtasks[position].title, 'isCompleted': false} :
    {'title': subtasks[position].title, 'isCompleted': true}
    // Update subTasks completed status
      setSubtasks(subTasksCopy)
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
                value="status"
                checked={subtasksChecked[idx]}
                onChange={(e) => {
                  handleSelected(e, idx)
                  handleChange(e, idx)
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
