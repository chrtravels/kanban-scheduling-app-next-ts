'use client'

import styles from './editTask.module.scss'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DropdownList from '../../dropownList/DropdownList';


type Params = {
  databaseId: number,
  boardStatus: string,
  boardName: string,
  tasks: [],
  taskId: number,
  task: {
    title: string,
    status: string,
    subtasks: [{title: string, isCompleted: boolean}],
    description: string
  },
  statusTypes: string[],
  setShowTask: () => boolean
}

type Task = {
  title: string,
  status: string,
  subtasks: [{title: string, isCompleted: boolean}],
  description: string
}

type Subtasks = [{
  title: string,
  isCompleted: boolean
}]

export default function EditTask(props: Params) {
  const { databaseId, boardStatus, boardName, taskId, tasks, task, statusTypes, setShowTask } = props;

  const [currentTask, setCurrentTask] = useState<Task>({
    title: task.title,
    status: task.status,
    subtasks: task.subtasks,
    description: task.description
  })

  const [selectedOption, setSelectedOption] = useState(currentTask.status);
  const [subtasks, setSubtasks] = useState<Subtasks>(currentTask.subtasks);
  // const [newSubtask, setNewSubtask] = useState(false)

  const router = useRouter();

  useEffect(() => {
    setCurrentTask({
      title: currentTask.title,
      status: currentTask.status,
      subtasks: subtasks,
      description: currentTask.description
    });

  }, [subtasks])


  function handleAddTask (e) {
    e.preventDefault();
    setSubtasks([...currentTask.subtasks, {'title': '', 'isCompleted': false}]);
  }

  function handleRemoveSubtask (e, index) {
    const tempSubtasks = [...subtasks];
    tempSubtasks.splice(index, 1)
    setSubtasks([...tempSubtasks])
  }

  const handleSubmit = async () => {
    const updatedTasks: [{}] = [...tasks];
    updatedTasks[taskId] = currentTask;

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

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <span className='modal-header heading-l'>Edit Task</span>
        <div className={styles.cancelButton}>
          <button onClick={() => setShowTask(false)}>x</button>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <span className='subtask-header body-m'>Title</span>
            <input
              type='text'
              id='title'
              name='title'
              value={currentTask.title}
              onChange={(e) => setCurrentTask((currentTask) => ({
                ...currentTask, [e.target.id]: e.target.value
              }))}
            />
          </div>

          <div className={styles.formRow}>
            <span className='body-m'>Description</span>
            <textarea
              id='description'
              name='description'
              rows={4}
              value={currentTask.description}
              placeholder='Add your description here...'
              onChange={(e) => setCurrentTask((currentTask) => ({
                ...currentTask, [e.target.id]: e.target.value
              }))}
            />
          </div>

          <div className={styles.formRow}>
            <span className='subtask-header body-m'>Subtasks</span>

            {subtasks.map((subtask, index) => {
              return (
                <div id={`${subtask.title[0]}-${index}`} className={styles.subtaskRow}>
                  <input
                    type='text'
                    id='subtasks'
                    name='subtasks'
                    value={subtask.title}
                    onChange={(e) => {
                      const tempSubtasks = [...subtasks];
                      let obj = tempSubtasks[index];
                      obj.title =  e.target.value;
                      tempSubtasks[index] = obj;
                      setSubtasks([...tempSubtasks])
                      }
                    }
                  />

                  <div className={styles.deleteButton} onClick={(e) => handleRemoveSubtask(e, index)}>
                    <Image
                    src='/assets/icon-cross.svg'
                    height={15}
                    width={15}
                    alt='delete subtask button'
                    />
                  </div>
                </div>
              )
            })}

            <div className={styles.btnContainer}>
              <button className='btn-small btn-secondary' onClick={(e) => handleAddTask(e)}>+ Add New Subtask</button>
            </div>
          </div>

          <div className={styles.status}>
            <span className='body-m status-header'>Status</span>
            <div className={styles.dropdownContainer}>
              <select
              id='status'
              name='status'
              className='nativeSelect'
              aria-labelledby='statusLabel'
              value={currentTask.status}
              onChange={(e) => setCurrentTask((currentTask) => ({
                  ...currentTask, [e.target.id]: e.target.value
                }))}>
                {props.statusTypes.map((option) => {
                  return <option value={option}>{option}</option>
                })}
              </select>

              <DropdownList
              options={statusTypes}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              currentFieldName='status'
              state={currentTask}
              setState={setCurrentTask}
              />
            </div>
          </div>

          <div className={styles.btnContainer}>
            <button className='btn-small btn-primary' onClick={() => handleSubmit()}>Save Changes</button>
          </div>
        </form>
      </div>

    </div>
  )
}
