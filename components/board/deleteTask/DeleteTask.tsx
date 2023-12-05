import styles from './deleteTask.module.scss'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function DeleteTask(props) {
  const { boardName, columnName, taskId, setShowDeleteTask, setShowTask } = props;

  const [boards, setBoards] = useState([]);
  const [currentTask, setCurrentTask] = useState({});

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/boards');

      const data = await res.json();
      setBoards(data);
      return Response.json(data);
    }
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentTask(boards.filter((board) => {
      if (boardName == board.board_name) {

        board.columns.map((column) => {
          if (columnName === column.name) {
            return column.tasks[taskId];
          }
        })

      }
    }))
  }, [boards])
  console.log('board name: ', boardName)
  console.log('boards: ', boards)
  console.log('current: ', currentTask)

  // Deleting a task is actually removing it from the board row, so it's a PATCH
  async function handleRemoveTask() {
    const options = {
      method: 'PATCH', // PATCH
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([boardName])
    }

    try {
      const res = await fetch('/api/task', options);
      const data = res.json();

      if (res.ok) {
        setShowDeleteTask(false);
        router.refresh();
      }
    } catch (error) {
      throw new Error('Error deleting task')
    }
  }


  return (
    <div className={styles.overlay}>
      <div className={`card ${styles.modal}`}>
        <span className='heading-m'>Delete this task?</span>

        <p className='body-m'>Are you sure you want to delete the '{currentTask.name}' task and it's subtasks? This action cannot be reversed.</p>

        <div className={styles.btnContainer}>
          <button className='btn-small btn-destructive' onClick={handleRemoveTask}>Delete</button>

          <button className='btn-small btn-secondary' onClick={() => setShowDeleteTask(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
