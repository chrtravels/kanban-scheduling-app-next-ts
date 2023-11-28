'use client'

import styles from './createBoard.module.scss'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DropdownList from '../../dropownList/DropdownList';


type Params = {
  setShowAddBoardModal: React.Dispatch<React.SetStateAction<boolean>>,
}

type Board = {
  title: string,
  status: string,
  subtasks: [{title: string, isCompleted: boolean}] | [],
  description: string
}

type Subtasks = [{
  title: string,
  isCompleted: boolean
}]


export default function CreateBoard(props: Params) {
  const { setShowAddBoardModal } = props;
  const [rowToUpdate, setRowToUpdate] = useState([{}])

  const [newBoard, setNewBoard] = useState({
    name: '',
    statusList: []
  })

  const [columnNames, setColumnNames]  = useState([]);

  const router = useRouter();

  useEffect(() => {
    setNewBoard({
      name: newBoard.name,
      statusList: [...columnNames],
    });

  }, [columnNames])

  // SET BOARD NAME AND COLUMNS TO BE UNIQUE TO AVOID DUPLICATE ENTRIES
  function handleAddColumn (e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setColumnNames([...columnNames, e.target.id]);
  }

  function handleRemoveColumn (e: React.MouseEvent<HTMLElement>, index: number) {
    const tempColumns = [...columnNames];
    tempColumns.splice(index, 1)
    setColumnNames([...tempColumns])
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    // COLUMN HAS TO BE SUBMITTED TO HANDLE SUBMIT MULTIPLE TIMES TO CREATE ALL OF THE STATUS ROWS
    const boardName = newBoard.name;

    if (boardName) {
      columnNames.forEach(async (statusName) => {
        const options = {
          method: 'POST',
          header: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify([boardName, statusName])
        }

        try {
          const res = await fetch('/api/boards', options);
          const data = await res.json();

          if (res.ok) {
            router.refresh();
          }
        } catch (error) {
          console.log(error)
          throw new Error('Error updating task')
        }
      })
      setShowAddBoardModal(false);
      router.refresh();
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
                onChange={(e) => setNewBoard((board) => ({
                  ...newBoard, [e.target.id]: e.target.value
                }))}
              />
            </div>

            <div className={styles.formRow}>
              <span className='subtask-header body-m'>Board Columns</span>

              {columnNames.map((name, index) => {
                return (
                  <div id={name} className={styles.statusRow}>
                    <input
                      type='text'
                      id='columnNames'
                      name='columnNames'
                      value={columnNames[index]}
                      onChange={(e) => {
                        const tempColumns = [...columnNames];
                        tempColumns[index] = e.target.value;
                        setColumnNames([...tempColumns])
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
              <button className='btn-small btn-primary' onClick={(e) => handleSubmit(e)}>Create New Board</button>
            </div>
          </form>
        </div>

        </div>
      </div>

    </div>
  )
}
