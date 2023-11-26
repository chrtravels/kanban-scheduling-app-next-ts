'use client'

import { useTheme } from 'next-themes'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import styles from './navbar.module.scss'
import AddTask from '../board/addTask/AddTask';

type Params = {
  sidebarExpanded: boolean,
  showAddTask: boolean,
  // setShowAddTask: Dispatch<SetStateAction<boolean>>,
  setCurrentBoard: () => string,
  currentBoard: string,
  statusList: string[],
}

const Navbar = ( props: Params ) => {
  const {sidebarExpanded, showAddTask, currentBoard, setCurrentBoard, statusList} = props;

  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState (false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

  // const searchParams = useSearchParams();
  // const boardName = searchParams.get('board');
  // console.log(boardName)
  const contentStyle = {
    transition: "all 0.5s ease-in-out",
};


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }


  return (
    <div className={styles.wrapper}>
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
          <div className={sidebarExpanded ? styles.activeSidebar : styles.boardName} style={contentStyle}><h2>Platform Launch</h2></div>
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
        <Image
          src='/assets/icon-vertical-ellipsis.svg'
          height={20}
          width={5}
          alt='edit button'
        />
      </div>
      </div>
    </div>

  )
}

export default Navbar;
