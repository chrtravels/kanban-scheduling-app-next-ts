'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './viewTask.module.scss'
import DropdownList from '../../dropownList/DropdownList';
import EditTask from '../editTask/EditTask';
import { isEqual } from 'lodash';


export default function ViewTask(props) {
  const { boardName, boardStatus, tasks, taskId, task, statusTypes, setShowTask, setShowDeleteTask } = props;

  const [columns, setColumns] = useState([]);
  const [selectedOption, setSelectedOption] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [showActionsBox, setShowActionsBox] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const res = await fetch(`/api/task?boardName=${boardName}`);
      const data = await res.json();
      setColumns(data[0].columns);
      return Response.json(data);
    }
    fetchData()
  }, [])

  const [taskState, setTaskState] = useState({
    title: task.title,
    status: task.status,
    subtasks: subtasks,
    description: task.description
  })


  // Calculates the # of tasks completed for the subtasks header
  const tasksCompleted = () => {
    let numCompleted= 0;

    subtasks.forEach((subtask) => {
      if (subtask.isCompleted) {
        numCompleted++;
      }
    })

    return numCompleted;
  }

  // Setup array to contain the boolean checked state of the check boxes
  const [subtasksChecked, setSubtasksChecked] = useState(
    subtasks.map((subtask) => {
      return subtask.isCompleted
    })
  );

  useEffect(() => {
    // Handle the checkbox state changes
    setSubtasksChecked(() => {
      const checkedSubtasks = subtasks.map((subtask) => {
        return subtask.isCompleted;
      })
      return [...checkedSubtasks];
    })
  }, [subtasks])

  function handleSelected (e, position) {
    e.preventDefault();

    const subtasksCopy = [...subtasks];

    subtasksCopy[position] = subtasks[position].isCompleted ?
    {'title': subtasks[position].title, 'isCompleted': false} :
    {'title': subtasks[position].title, 'isCompleted': true}
    // Update subTasks completed status
    setSubtasks([...subtasksCopy])
    setTaskState((taskState) => ({
      ...taskState, 'subtasks': subtasksCopy
    }))
  }

  async function handleUpdateTask () {
    // Updates the task on the database when the task is marked completed
    const updatedTasks = [...tasks];
    const clonedTask = Object.assign({}, taskState);
    const updatedColumns = [...columns];

    if (boardStatus === taskState.status || taskState.status === '') {
      // Checks if the task status has been changed to see if we should switch columns
      updatedTasks[taskId] = clonedTask;

      updatedColumns.forEach((column) => {
      if (boardStatus === column.name) {
        column.tasks = [...updatedTasks];
        return column;
      } else return column;
      setColumns([...updatedColumns]);
    })
    } else {
      updatedColumns.forEach((column) => {
        if (column.name === boardStatus) {
          column.tasks.splice(taskId,1)
        } else if (column.name === taskState.status) {
          column.tasks.push(clonedTask);
        }
      })
      setColumns([...updatedColumns]);
    }

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([boardName, updatedColumns])
    }

    try {
      const res = await fetch('/api/task', options);

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      throw new Error('Error updating task')
    }

  }

  function handleEditTask (e) {
    setShowActionsBox(false);
    setShowEditTask(true);
  }

  // Updates any subtask change & closes task modal
  function handleOutsideClick() {
    if (!isEqual(taskState, task)) {
      handleUpdateTask()
    }
    setShowEditTask(false)
    setShowTask(false)
  }


  if (showEditTask) {
    return (
      <div className={styles.overlay} onClick={handleOutsideClick}>
        <div className={`card ${styles.editContainer}`} onClick={e => e.stopPropagation()}>
          <EditTask boardStatus={boardStatus} boardName={boardName} tasks={tasks} taskId={taskId} task={taskState} columns={columns} setColumns={setColumns} statusTypes={statusTypes} setShowTask={setShowTask} />
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.overlay} onClick={handleOutsideClick}>
        <div className={`card ${styles.taskContainer}`} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            {showActionsBox && (
              <div className={`actions-container ${styles.actionsContainer}`}>
                <button className='heading-s' value='edit' onClick={(e) => handleEditTask(e)}>Edit Task</button>
                <button className='heading-s' value='delete' onClick={() => {
                  setShowTask(false);
                  setShowDeleteTask(true);
                }}>Delete Task</button>
                <button className='heading-s' value='cancel' onClick={() => setShowTask(false)}>Cancel</button>
              </div>
            )}

            <h3>{task.title}</h3>
            <div className={styles.actionsButton} onClick={() => {setShowActionsBox(!showActionsBox)}}>
              <Image
              src='/assets/icon-vertical-ellipsis.svg'
              height={20}
              width={5}
              alt='edit button'
              />
            </div>
          </div>

          <p className='body-l'>{task.description}</p>
          <span className='heading-s subtask-header'>Subtasks ({tasksCompleted()} of {task.subtasks.length})</span>

          <div className={styles.subtasks}>
            {task.subtasks.map((subtask, idx) => {
              return (
                <div key={subtask.title} className={`subtask body-l ${styles.subtask}`}>
                  <input
                  className='checkbox'
                  id={subtask.title}
                  type='checkbox'
                  value='status'
                  checked={subtasksChecked[idx]}
                  onChange={(e) => handleSelected(e, idx)}
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
              id='status'
              name='status'
              className='nativeSelect'
              aria-labelledby='currentStatusLabel'
              value={taskState.status}
              onChange={(e) => setTaskState((taskState) => ({
                  ...taskState, [e.target.id]: e.target.value
                }))
              }>
                {props.statusTypes.map((option) => {
                  return <option key={option} value={option}>{option}</option>
                })}
              </select>

              <DropdownList
              options={props.statusTypes}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              currentFieldName='status'
              state={taskState}
              setState={setTaskState}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
