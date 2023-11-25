'use client'

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './viewTask.module.scss'
import DropdownList from '../../dropownList/DropdownList';
import EditTask from '../editTask/EditTask';



type Params = {
  databaseId: number,
  boardName: string,
  boardStatus: string,
  tasks: [],
  taskId: number,
  task: {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  },
  statusTypes: string[],
  setShowTask: () => boolean,
}

export default function ViewTask(props: Params) {
  const { databaseId, boardName, boardStatus, tasks, taskId, task, statusTypes, setShowTask } = props;

  const [selectedOption, setSelectedOption] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [showActionsBox, setShowActionsBox] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);

  const router = useRouter();

  type TaskState = {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  }

  const [taskState, setTaskState] = useState<TaskState>({
    title: task.title,
    status: task.status,
    subtasks: subtasks,
    description: task.description
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

  // Setup array to contain the state of the check boxes
  const [subtasksChecked, setSubtasksChecked] = useState(
    subtasks.map((subtask) => {
      return subtask.isCompleted
    })
  );

  function handleSelected (e, position) {
    // Handle the checkbox state changes
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

    setTaskState((taskState) => ({
      ...taskState, 'subtasks': subTasksCopy
    }))
    // Updates the task on the database when the task is marked completed
    handleUpdateTask(subTasksCopy)
  }


  function handleEditTask (e) {
    setShowActionsBox(false);
    setShowEditTask(true);
  }

  const handleUpdateTask = async (subtasks) => {
    const updatedTasks: [{}] = [...tasks];
    const clonedTaskState = Object.assign({}, taskState);
    clonedTaskState.subtasks = subtasks
    console.log('status:', clonedTaskState.status)
    updatedTasks[taskId] = clonedTaskState;

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([databaseId, boardStatus, updatedTasks])
    }

    try {
      const res = await fetch('/api/task', options);
      const data = res.json();

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      throw new Error('Error updating task')
    }
  }

  // Used to update the task on the database when the status changes
  useMemo(() => {
    handleUpdateTask(taskState.subtasks)
  }, [taskState])


  if (showEditTask) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.editContainer}`}>
          <EditTask databaseId={databaseId} boardStatus={boardStatus} boardName={boardName} tasks={tasks} taskId={taskId} task={taskState} statusTypes={statusTypes} setShowTask={setShowTask} />
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.taskContainer}`}>
          <div className={styles.header}>
            {showActionsBox && (
              <div className={`actions-container ${styles.actionsContainer}`}>
                <button className='heading-s' value='edit' onClick={(e) => handleEditTask(e)}>Edit Task</button>
                <button className='heading-s' value='delete' onClick={(e) => handleDeleteTask(e)}>Delete Task</button>
                <button className='heading-s' value='cancel' onClick={(e) => props.setShowTask(false)}>Cancel</button>
              </div>
            )}

            <h3>{task.title}</h3>
            <div className={styles.actionsButton} onClick={() => setShowActionsBox(!showActionsBox)}>
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
                  return <option value={option}>{option}</option>
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
