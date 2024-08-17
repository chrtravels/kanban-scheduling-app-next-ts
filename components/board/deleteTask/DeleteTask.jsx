import styles from './deleteTask.module.scss'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function DeleteTask(props) {
  const { boardName, columnName, taskId, setShowDeleteTask } = props;

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]); // set type here for error on line 32
  const [currentTask, setCurrentTask] = useState({});

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/task?boardName=${boardName}&boardStatus=${columnName}`);
      const data = await res.json();

      setColumns(data[0].columns)

      data[0].columns.forEach((column) => {
        if (columnName === column.name) {
          const tempTasks = [...column.tasks]
          setTasks(tempTasks)
          setCurrentTask(column.tasks[taskId]);
        }
      })
      return Response.json(data);
    }
    fetchData()
  }, [])

  // Deleting a task is removing it from the board row, so we use PATCH
  async function handleRemoveTask(e) {
    e.preventDefault();

    const tempTasks = [...tasks]
    tempTasks.splice(taskId, 1);

    const tempColumns = [...columns];

    tempColumns.forEach((column) => {
      if (columnName === column.name) {
        const tempNewTasks = [...tempTasks]
        column.tasks = tempNewTasks;
      }
    })

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([boardName, tempColumns])
    }

    try {
      const res = await fetch('/api/task', options);

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

        <p className='body-m'>Are you sure you want to delete the '{currentTask.title}' task and it's subtasks? This action cannot be reversed.</p>

        <div className={styles.btnContainer}>
          <button className='btn-small btn-destructive' onClick={(e) => handleRemoveTask(e)}>Delete</button>

          <button className='btn-small btn-secondary' onClick={() => setShowDeleteTask(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
