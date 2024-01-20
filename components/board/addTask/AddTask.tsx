'use client'

import styles from './addTask.module.scss'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DropdownList from '../../dropownList/DropdownList';


type Params = {
  currentBoard: string,
  setCurrentBoard: () => string,
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>,
  statusList: string[]
}

type Task = {
  title: string,
  status: string,
  subtasks: Subtasks,
  description: string
}

type Subtasks = [{
  title: string,
  isCompleted: boolean
}] | any

type Columns = {
  name: string,
  tasks: [{}]
} | {}

type Board = [{
  id: Number, board_name: string, columns: []
}] | []

export default function AddTask(props: Params) {
  const { currentBoard, setCurrentBoard, setShowAddTaskModal, statusList } = props;
  const [rowToUpdate, setRowToUpdate] = useState<Board>([])

  const [newTask, setNewTask] = useState<Task>({
    title: '',
    status: '',
    subtasks: [],
    description: ''
  })
//() => void
  const [selectedOption, setSelectedOption] = useState<string>(newTask.status);
  const [subtasks, setSubtasks]  = useState<Subtasks>(newTask.subtasks)

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
    const controller = new AbortController();

    const fetchData = async () => {
      const res = await fetch(`/api/task?boardName=${currentBoard}&boardStatus=${selectedOption}`, {
        signal: controller.signal
      });
      const data = await res.json();
      setRowToUpdate(data);

      return () => controller.abort();
    }
    fetchData()
  }, [selectedOption])

  function handleAddTask (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const tempNewSubtasks = [...newTask.subtasks, {name: '', isCompleted: false}];
    setSubtasks([...tempNewSubtasks]);
  }

  function handleRemoveSubtask (e: React.MouseEvent<HTMLDivElement>, index: number) {
    const tempSubtasks: Subtasks = [...subtasks];
    tempSubtasks.splice(index, 1)
    setSubtasks([...tempSubtasks])
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { columns }: any = rowToUpdate[0];

    const updatedColumns = [...columns];

    updatedColumns.map((column: any) => {
      if (selectedOption === column.name) {
        column.tasks.push(newTask);
        return column;
      } else return column;
    })

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([currentBoard, updatedColumns])
    }

    try {
      const res = await fetch('/api/task', options);
      const data = res.json();

      if (res.ok) {
        router.refresh();
        setShowAddTaskModal(false);
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
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Title</span>
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
              <span className='body-m'>Description</span>
              <textarea
                id='description'
                name='description'
                rows={4}
                value={newTask.description}
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                onChange={(e) => setNewTask((newTask) => ({
                  ...newTask, [e.target.id]: e.target.value
                }))}
              />
            </div>

            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Subtasks</span>

              {subtasks.map((subtask: {title: string, isCompleted: boolean}, index: number) => {
                return (
                  <div key={`${subtask.title}-${index}`} className={styles.subtaskRow}>
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
              <button className='btn-small btn-primary'>Create Task</button>
            </div>
          </form>
        </div>

        </div>
      </div>

    </div>
  )
}
