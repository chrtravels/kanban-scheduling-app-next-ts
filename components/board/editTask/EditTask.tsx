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
  statusTypes: string[],
  setShowEditTask: () => boolean
}

export default function EditTask(props: Params) {
  const task = props.task;
  const [selectedOption, setSelectedOption] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [showActionsBox, setShowActionsBox] = useState(true);

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

    subtasks.forEach((subtask: {title: string, isCompleted: boolean}) => {
      if (subtask.isCompleted) {
        numCompleted++;
      }
    })

    return numCompleted;
  }

  type Options = () => [{}]

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
    const subTasksCopy: [{title: string, isCompleted: boolean}] = [...subtasks];

    subTasksCopy[position] = subtasks[position].isCompleted ?
    {'title': subtasks[position].title, 'isCompleted': false} :
    {'title': subtasks[position].title, 'isCompleted': true}
    // Update subTasks completed status
    setSubtasks(subTasksCopy)

  }

  function handleEditOptions (e) {
    const value = e.target.value;
    if (value === 'cancel') {
      props.setShowEditTask(false);
    }
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
          {showActionsBox && (
            <div className={`actions-container ${styles.actionsContainer}`}>
              <button className='heading-s' value='save' onClick={(e) => handleEditOptions(e)}>Save Task Edits</button>
              <button className='heading-s' value='delete' onClick={(e) => handleEditOptions(e)}>Delete Task</button>
              <button className='heading-s' value='cancel' onClick={(e) => handleEditOptions(e)}>Cancel</button>
            </div>
          )}

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
              <div className={`subtask body-l ${styles.subtask}`}>
                <input
                className='checkbox'
                id={subtask.title}
                type='checkbox'
                value='status'
                checked={subtasksChecked[idx]}
                onChange={(e) => {
                  handleSelected(e, idx)
                  handleChange(e, idx)
                }}
                />
                <span className={subtasksChecked[idx] ? styles.completedSubtask : ''}>{subtask.title}</span>
                </div>
            )
          })}
        </div>

        <div className={styles.status}>
          <span className='body-m status-header'>Current Status</span>
          <div className={styles.dropdownContainer}>
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
    </div>
  )
}
