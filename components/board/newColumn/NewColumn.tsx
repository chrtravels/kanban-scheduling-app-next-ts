import styles from './newColumn.module.scss'

import { useRouter } from 'next/navigation';

export default function NewColumn(props) {
  const { boardName, currentBoard } = props;

  const router = useRouter();

  const addNewColumn = async () => {
    const updatedBoard = Object.assign({}, currentBoard);
    updatedBoard.columns.push({'name': 'New Column', 'tasks': []})

    const updatedColumns = updatedBoard.columns;
    const boardId = currentBoard.id;

    const options = {
      method: 'PATCH',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([boardName, updatedColumns, boardId])
    }

    try {
      const res = await fetch('/api/boards', options);
      const data = res.json();

      if (res.ok) {
        router.push(`/${boardName}`)
      }
    } catch (error) {
      throw new Error('Error updating task')
    }

  }

  return (
    <div className={`new-column ${styles.container}`}>
      <span className='heading-l' onClick={(addNewColumn)}>+ New Column</span>
    </div>
  )
}
