'use client'

import styles from './editBoard.module.scss'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface Params {
  setShowEditBoardModal: React.Dispatch<React.SetStateAction<boolean>>,
  currentBoard: string
}

interface Board {
  id: number | null,
  name: string,
  columns: Columns,
}

type Columns = [{
  name: string,
  tasks: [{}],
  description: string
}] | any[]


export default function EditBoard(props: Params) {
  const { setShowEditBoardModal, currentBoard } = props;

  const [newBoard, setNewBoard] = useState<Board>({
    id: null,
    name: '',
    columns: [],
  })

  const [columnNames, setColumnNames]  = useState<Columns>([]);

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

        const boardToEdit = data.filter((board: any) => {
          return board.board_name === currentBoard;
        })[0];

        setNewBoard({
          id: boardToEdit.id,
          name: boardToEdit.board_name,
          columns: boardToEdit.columns
        })

        setColumnNames(boardToEdit.columns.map((column: any) => {
          return column.name;
        }))

      } catch (error) {
        throw new Error('Error updating Board')
      }
    }
    fetchData()
  }, [])


  function handleAddColumn (e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setColumnNames([...columnNames, e.target.value]);
  }

  function handleRemoveColumn (e: React.MouseEvent<HTMLDivElement>, index: number) {
    const tempColumnNames = [...columnNames];
    tempColumnNames.splice(index, 1)
    setColumnNames([...tempColumnNames])
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
    <div className={styles.container}>
      <div className={`card ${styles.editBoardModal}`}>
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

              {columnNames.map((name, index) => {
                return (
                  <div key={name} className={styles.statusRow}>
                    <input
                      type='text'
                      id='columnNames'
                      name='columnNames'
                      value={columnNames[index]}
                      onChange={(e) => {
                        const tempNames = [...columnNames];
                        tempNames[index] = e.target.value;
                        setColumnNames([...tempNames]);
                      }}
                    />

                    <div className={styles.deleteButton} onClick={(e) => handleRemoveColumn(e, index)}>
                      <Image
                      src='/assets/icon-cross.svg'
                      height={15}
                      width={15}
                      alt='delete column button'
                      />
                    </div>
                  </div>
                )
              })}

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
