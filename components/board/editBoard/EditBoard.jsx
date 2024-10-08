'use client'

import styles from './editBoard.module.scss'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MapColumnInputs from '../_components/MapColumnInputs';



export default function EditBoard(props) {
  const { setShowEditBoardModal, currentBoard, handleOutsideClick } = props;

  const [newBoard, setNewBoard] = useState({
    id: null,
    name: '',
    columns: [],
  })

  const [columnNames, setColumnNames]  = useState([]);

  const router = useRouter();

  useEffect(() => {
    const newColumns = columnNames.map((name, idx) => {
      return ({
        name: name,
        tasks: idx < newBoard.columns.length ? newBoard.columns[idx].tasks : []
      })
    })

    setNewBoard({
      id: newBoard.id,
      name: newBoard.name,
      columns: [...newColumns]
    })

  }, [columnNames])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/boards');
        const data = await res.json();

        const boardToEdit = data.filter((board) => {
          return board.board_name === currentBoard;
        })[0];

        setNewBoard({
          id: boardToEdit.id,
          name: boardToEdit.board_name,
          columns: boardToEdit.columns
        })

        setColumnNames(boardToEdit.columns.map((column) => {
          return column.name;
        }))

      } catch (error) {
        throw new Error('Error updating Board')
      }
    }
    fetchData()
  }, [])


  function handleAddColumn (e) {
    e.preventDefault();
    setColumnNames([...columnNames, e.target.value]);
  }

  const handleSubmit = async () => {

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([newBoard.name, newBoard.columns, newBoard.id])
    }

    try {
      const res = await fetch('/api/boards', options);
      const data = res.json();

      if (res.ok) {
        setShowEditBoardModal(false);
        router.push(`/${newBoard.name}`)
      }

    } catch (error) {
      throw new Error('Error updating Board')
    }
  }

  return (
    <div className={styles.container} id='showEditBoardModal' onClick={(e) => handleOutsideClick(e)}>
      <div className={`card ${styles.editBoardModal}`} onClick={e => e.stopPropagation()}>
        <div className={styles.formWrapper}>
        <div className={styles.header}>
          <span className='modal-header heading-l'>Edit Board</span>
          <div className={styles.cancelButton}>
            <button onClick={() => setShowEditBoardModal(false)}>x</button>
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
                onChange={(e) => setNewBoard((board) => ({
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
                <button className='btn-small btn-primary' >Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
