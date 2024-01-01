'use client'

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './viewTask.module.scss'
import DropdownList from '../../dropownList/DropdownList';
import EditTask from '../editTask/EditTask';


type Params = {
  boardName: string,
  boardStatus: string,
  tasks: [{
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  }],
  taskId: number,
  task: {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  },
  statusTypes: string[],
  setShowTask: React.Dispatch<React.SetStateAction<boolean>>,
  setShowDeleteTask: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewTask(props: Params) {
  const { boardName, boardStatus, tasks, taskId, task, statusTypes, setShowTask, setShowDeleteTask } = props;

  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [selectedOption, setSelectedOption] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [showActionsBox, setShowActionsBox] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/task?boardName=${boardName}`);
      const data = await res.json();
      setBoard(data[0]);
      setColumns(data[0].columns);
      return Response.json(data);
    }
    fetchData()
  }, [])

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

  // Calculates the # of tasks completed for the subtasks header
  const tasksCompleted: TasksCompleted = () => {
    let numCompleted= 0;

    subtasks.forEach((subtask: {title: string, isCompleted: boolean}) => {
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

    const subtasksCopy: [{title: string, isCompleted: boolean}] = [...subtasks];

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
    const updatedTasks: [{}] = [...tasks];
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
    console.log('task state: ', taskState)
    console.log('updated columns: ', updatedColumns)

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

  function handleEditTask (e: React.MouseEvent<HTMLButtonElement>) {
    setShowActionsBox(false);
    setShowEditTask(true);
  }

  if (showEditTask) {
    return (
      <div className={styles.overlay}>
        <div className={`card ${styles.editContainer}`}>
          <EditTask boardStatus={boardStatus} boardName={boardName} tasks={tasks} taskId={taskId} task={taskState} statusTypes={statusTypes} setShowTask={setShowTask} />
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.overlay}>
        <div className={`card ${styles.taskContainer}`}>
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
            <div className={styles.actionsButton} onClick={() => {
              handleUpdateTask ()
              setShowActionsBox(!showActionsBox)}
            }>
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
