import styles from './deleteBoard.module.scss'

import { useRouter } from 'next/navigation';


export default function DeleteBoard(props) {
  const { currentBoard, setCurrentBoard, setShowDeleteBoardModal, boards, handleOutsideClick } = props;

  const router = useRouter();

  async function handleDelete() {
    const options = {
      method: 'DELETE',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify([currentBoard])
    }

    try {
      const res = await fetch('/api/boards', options);
      const data = res.json();

      if (res.ok) {
        setCurrentBoard(boards[0].board_name)
        setShowDeleteBoardModal(false);

        router.push(`/`);
      }
    } catch (error) {
      throw new Error('Error deleting board')
    }
  }


  return (
    <div className={styles.overlay} id='showDeleteBoardModal' onClick={(e) => handleOutsideClick(e)}>
      <div className={`card ${styles.modal}`} onClick={e => e.stopPropagation()}>
        <span className='heading-m'>Delete this board?</span>

        <p className='body-m'>Are you sure you want to delete the '{currentBoard}'? This action will remove all columns and tasks and cannot be reversed.</p>

        <div className={styles.btnContainer}>
          <button className='btn-small btn-destructive' onClick={handleDelete}>Delete</button>

          <button className='btn-small btn-secondary' onClick={() => setShowDeleteBoardModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
