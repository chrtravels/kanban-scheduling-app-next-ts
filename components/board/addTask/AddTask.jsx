'use client'

import styles from './addTask.module.scss'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DropdownList from '../../dropownList/DropdownList';
import SubtasksInput from './_components/SubtasksInput';


export default function AddTask(props) {
  const { currentBoard, setShowAddTaskModal, statusList, handleOutsideClick } = props;
  const [rowToUpdate, setRowToUpdate] = useState([])

  const [newTask, setNewTask] = useState({
    title: '',
    status: '',
    subtasks: [],
    description: ''
  })

  const [selectedOption, setSelectedOption] = useState(newTask.status)
  const [subtasks, setSubtasks]  = useState([])
  const [showStatusRequired, setShowStatusRequired] = useState(false)

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

  function handleAddTask (e) {
    e.preventDefault();

    const tempNewSubtasks = [...subtasks, {title: '', isCompleted: false}];
    setSubtasks([...tempNewSubtasks]);
  }

  const handleChange = (e) => {
    setNewTask((newTask) => ({
      ...newTask, [e.target.id]: e.target.value
    }))
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
     // Truthy check if status is selected before submitting
    if (!newTask.status) {
      setShowStatusRequired(true)
      return
    }

    const { columns } = rowToUpdate[0];

    const updatedColumns = [...columns];

    updatedColumns.map((column) => {
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
    <div className={styles.container} id='showAddTaskModal' onClick={(e) => handleOutsideClick(e)}>
      <div className={`card ${styles.addTaskModal}`} onClick={e => e.stopPropagation()}>
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
                  onChange={(e) => handleChange(e)}
                  required
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
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className={styles.formRow}>
                <span className='subtask-header body-m'>Subtasks</span>

                {subtasks.length > 0 && (
                  <SubtasksInput subtasks={subtasks} setSubtasks={setSubtasks} />
                )}


                <div className={styles.btnContainer}>
                  <button className='btn-small btn-secondary' onClick={(e) => handleAddTask(e)}>+ Add New Subtask</button>
                </div>
              </div>

              <div className={styles.status}>
                <span className='body-m status-header'>Status</span>
                <div className={styles.dropdownContainer} onClick={() => {setShowStatusRequired(false)}}>
                  {showStatusRequired && (
                  <div className={styles.statusRequired}>Please fill out this field</div>
                  )}
                  <select
                  id='status'
                  name='status'
                  className='nativeSelect'
                  aria-labelledby='statusLabel'
                  value={newTask.status}
                  onChange={(e) => handleChange(e)}
                  required
                  >
                    {props.statusList.map((option) => {
                      return <option key={option} value={option}>{option}</option>
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
