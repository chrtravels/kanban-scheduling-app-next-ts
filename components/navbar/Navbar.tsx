'use client'

import { useTheme } from 'next-themes'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import styles from './navbar.module.scss'
import AddTask from '../board/addTask/AddTask';
import EditBoard from '../board/editBoard/EditBoard';
import DeleteBoard from '../board/deleteBoard/DeleteBoard';

type Params = {
  sidebarExpanded: boolean,
  showAddTask: boolean,
  setCurrentBoard: () => string,
  currentBoard: string,
  statusList: string[],
  boards: [{}]
}

const Navbar = ( props: Params ) => {
  const {sidebarExpanded, currentBoard, setCurrentBoard, statusList, boards} = props;

  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState (false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  // Shows the ellipsis actions modal
  const [showActions, setShowActions] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  let navbarTitle;
  if (currentBoard) navbarTitle = currentBoard.split(' ').map((word) => {
    return word.slice(0,1).toUpperCase() + word.slice(1);
  }).join(' ');


  // const searchParams = useSearchParams();
  // const boardName = searchParams.get('board');

  const contentStyle = {
    transition: "all 0.5s ease-in-out",
};

// Removes scrollbar when modal open
useEffect(() => {
  if (showAddTaskModal || showEditBoardModal || showDeleteBoardModal) {
    document.body.classList.add("overflow-y-hidden")
  } else {
    document.body.classList.remove("overflow-y-hidden")
  }
}, [showAddTaskModal, showEditBoardModal, showDeleteBoardModal])

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }


  return (
    <div className={styles.wrapper}>
      {showActions && (
        <div className={`actions-container ${styles.actionsContainer}`}>
          <button className='heading-s' value='edit' onClick={() => {
            setShowEditBoardModal(true)
            setShowActions(false)
          }}>Edit Board</button>
          <button className='heading-s' value='delete' onClick={() => {
            setShowDeleteBoardModal(true)
            setShowActions(false)
          }}>Delete Board</button>
        </div>
      )}

      {showEditBoardModal && (
        <EditBoard
        setShowEditBoardModal={setShowEditBoardModal}
        currentBoard={currentBoard}
        />
      )}

      {showDeleteBoardModal && (
        <DeleteBoard
        setShowDeleteBoardModal={setShowDeleteBoardModal}
        currentBoard={currentBoard}
        setCurrentBoard={setCurrentBoard}
        boards={boards}
        />
      )}

      {showAddTaskModal && (
          <AddTask
          currentBoard={currentBoard}
          setCurrentBoard={setCurrentBoard}
          setShowAddTaskModal={setShowAddTaskModal}
          statusList={statusList}
          />
        )}
      <div className={`navbar ${styles.container}`}>
        <div className={styles.leftContent}>
          <div className={`sidebar ${styles.logo}`}>
            {theme === 'dark' ? (
              <Image
              src='/assets/logo-light.svg'
              height={26}
              width={153}
              alt='kanban logo'
              />
            ) :
              (
              <Image
              src='/assets/logo-dark.svg'
              height={26}
              width={153}
              alt='kanban logo'
              />
              )
            }
          </div>
          <div className={sidebarExpanded ? styles.activeSidebar : styles.boardName} style={contentStyle}><h2>{navbarTitle}</h2></div>
        </div>

        <div className={styles.navbarActions}>
          <div className={styles.addTaskBtn} onClick={() => setShowAddTaskModal(true)}>
            <Link
              href={`/${currentBoard}`}
            >
              <button
              className='btn-large btn-primary'
              aria-label='Add New Task'
              type='button'
              >
              +Add New Task
              </button>
            </Link>

          </div>
        <div className={styles.ellipsisMenu} onClick={() => setShowActions(!showActions)}>
          <Image
            src='/assets/icon-vertical-ellipsis.svg'
            height={20}
            width={5}
            alt='edit button'
          />
        </div>
      </div>
      </div>
    </div>

  )
}

export default Navbar;
