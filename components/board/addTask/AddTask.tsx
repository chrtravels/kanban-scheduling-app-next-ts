'use client'

import styles from './addTask.module.scss'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DropdownList from '../../dropownList/DropdownList';


type Params = {
  // databaseId: number,
  // boardStatus: string,
  currentBoard: string,
  setCurrentBoard: () => string,
  setShowAddTaskModal: () => boolean,
  statusList: string[]
  // tasks: [],
  // taskId: number,
  // task: {
  //   title: string,
  //   status: string,
  //   subtasks: [{title: string, isCompleted: boolean}],
  //   description: string
  // },
  // setShowAddTask: () => boolean
}

type Task = {
  title: string,
  status: string,
  subtasks: [{title: string, isCompleted: boolean}] | [],
  description: string
}

type Subtasks = [{
  title: string,
  isCompleted: boolean
}]

// HAVE TO CHANGE IT SO THAT THE BOARD NAME AND STATUS HAVE TO MATCH TO ADD OR UPDATE
// BECAUSE IF THE STATUS CHANGES ON EDIT YOU HAVE TO UPDATE A DIFFERENT BOARD & DEPENDING
// ON WHICH STATUS THE TASK GOES IT DETERMINES WHICH ID IS UPDATED
export default function AddTask(props: Params) {
  const { currentBoard, setCurrentBoard, setShowAddTaskModal, statusList } = props;

  const [newTask, setNewTask] = useState<Task>({
    title: '',
    status: '',
    subtasks: [],
    description: ''
  })

  const [selectedOption, setSelectedOption] = useState(newTask.status);
  const [subtasks, setSubtasks] = useState<Subtasks>(newTask.subtasks);
  // const [newSubtask, setNewSubtask] = useState(false)

  const router = useRouter();

  useEffect(() => {
    setNewTask({
      title: newTask.title,
      status: newTask.status,
      subtasks: subtasks,
      description: newTask.description
    });

  }, [subtasks])


  function handleAddTask (e) {
    e.preventDefault();
    setSubtasks([...newTask.subtasks, {'title': '', 'isCompleted': false}]);
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
    <div className={styles.container}>
      <div className={`card ${styles.addTaskModal}`}>
        <div className={styles.formWrapper}>
        <div className={styles.header}>
          <span className='modal-header heading-l'>Add Task</span>
          <div className={styles.cancelButton}>
            <button onClick={() => setShowAddTaskModal(false)}>x</button>
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
                value={newTask.title}
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
                value={newTask.description}
                placeholder='Add your description here...'
                onChange={(e) => setNewTask((newTask) => ({
                  ...newTask, [e.target.id]: e.target.value
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
                value={newTask.status}
                onChange={(e) => setNewTask((newTask) => ({
                    ...newTask, [e.target.id]: e.target.value
                  }))}>
                  {props.statusList.map((option) => {
                    return <option value={option}>{option}</option>
                  })}
                </select>

                <DropdownList
                options={statusList}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                currentFieldName='status'
                state={newTask}
                setState={setNewTask}
                />
              </div>
            </div>

            <div className={styles.btnContainer}>
              <button className='btn-small btn-primary' onClick={() => handleSubmit()}>Create Task</button>
            </div>
          </form>
        </div>

        </div>
      </div>

    </div>
  )
}
