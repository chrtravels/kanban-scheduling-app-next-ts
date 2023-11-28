'use client'

import styles from './editBoard.module.scss'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';


type Params = {
  setShowEditBoardModal: React.Dispatch<React.SetStateAction<boolean>>,
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


export default function EditBoard(props: Params) {
  const { setShowEditBoardModal } = props;
  const [rowToUpdate, setRowToUpdate] = useState([{}])

  const [newTask, setNewTask] = useState({
    title: '',
    status: '',
    subtasks: [],
    description: ''
  })

  const [selectedOption, setSelectedOption] = useState(newTask.status);
  const [subtasks, setSubtasks]  = useState(newTask.subtasks);

  const router = useRouter();

  useEffect(() => {
    setNewTask({
      title: newTask.title,
      status: selectedOption,
      subtasks: subtasks,
      description: newTask.description
    });

  }, [subtasks, selectedOption])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/board');
      const data = await res.json();
      setRowToUpdate(data);
      return Response.json(data);
    }
    fetchData()
  }, [selectedOption])


  function handleAddColumn (e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSubtasks([...newTask.subtasks, {'title': '', 'isCompleted': false}]);
  }

  function handleRemoveColumn (e: React.MouseEvent<HTMLDivElement>, index: number) {
    const tempSubtasks = [...subtasks];
    tempSubtasks.splice(index, 1)
    setSubtasks([...tempSubtasks])
  }


  const handleSubmit = async () => {
    const {id, status, tasks} = rowToUpdate[0];

    const updatedTasks = [...tasks];
    updatedTasks.push(newTask);

    const databaseId = id;
    const boardStatus = status;


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
          <span className='modal-header heading-l'>Add New Board</span>
          <div className={styles.cancelButton}>
            <button onClick={() => setShowAddTaskModal(false)}>x</button>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Board Name</span>
              <input
                type='text'
                id='title'
                name='title'
                value={newTask.title}
                placeholder='e.g. Take coffee break'
                onChange={(e) => setNewTask((newTask) => ({
                  ...newTask, [e.target.id]: e.target.value
                }))}
              />
            </div>

            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Board Columns</span>

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


            <div className={styles.btnContainer}>
              <button className='btn-small btn-primary' onClick={handleSubmit}>Create Task</button>
            </div>
          </form>
        </div>

        </div>
      </div>

    </div>
  )
}

async function getDatabaseRowId () {

}
