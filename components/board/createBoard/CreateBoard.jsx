'use client'

import styles from './createBoard.module.scss'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MapColumnInputs from '../_components/MapColumnInputs';


export default function CreateBoard(props) {
  const { setShowAddBoardModal, setCurrentBoard } = props;

  const [newBoard, setNewBoard] = useState({
    name: '',
    columns: []
  })

  const [columnNames, setColumnNames]  = useState([]);

  const router = useRouter();

  useEffect(() => {
    setNewBoard({
      name: newBoard.name,
      columns: columnNames.map((name) => {
        return {'name': name, 'tasks': [], description: ''}
      }),
    });

  }, [columnNames])

  function handleAddColumn (e) {
    e.preventDefault();
    setColumnNames([...columnNames, '']);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const boardName = newBoard.name.toLowerCase();
    const columns = newBoard.columns;

    if (boardName) {
        const options = {
          method: 'POST',
          header: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify([boardName, columns])
        }

        try {
          const res = await fetch('/api/boards', options);
          const data = await res.json();

          if (res.ok) {
            router.refresh();
          }
        } catch (error) {
          throw new Error('Error updating task')
        }
      setCurrentBoard(boardName);
      setShowAddBoardModal(false);
      router.push(`/${boardName.split(' ').join('-')}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`card ${styles.addBoardModal}`}>
        <div className={styles.formWrapper}>
        <div className={styles.header}>
          <span className='modal-header heading-l'>Add New Board</span>
          <div className={styles.cancelButton}>
            <button onClick={() => setShowAddBoardModal(false)}>x</button>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Board Name</span>
              <input
                type='text'
                id='name'
                name='name'
                value={newBoard.name}
                placeholder='e.g. Web Design'
                required
                onChange={(e) => setNewBoard((newBoard) => ({
                  ...newBoard, [e.target.id]: e.target.value
                }))}
              />
            </div>

            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Board Columns</span>

              <MapColumnInputs columnNames={columnNames} setColumnNames={setColumnNames} />

              <div className={styles.btnContainer}>
                <button className='btn-small btn-secondary' onClick={(e) => handleAddColumn(e)}>+ Add New Column</button>
              </div>
            </div>

            <div className={styles.btnContainer}>
              <button className='btn-small btn-primary' >Create New Board</button>
            </div>
          </form>
        </div>

        </div>
      </div>

    </div>
  )
}
