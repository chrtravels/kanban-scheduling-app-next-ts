'use client'

import styles from './sidebar.module.scss'

import { useTheme } from 'next-themes'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { DarkModeToggle } from '../darkModeToggle/DarkModeToggle';
import CreateBoard from '../board/createBoard/CreateBoard';



export default function Sidebar({ boardNames, sidebarExpanded, setSidebarExpanded, currentBoard, setCurrentBoard }) {
  const { theme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(false)
  // get urlparams from props to see if the page is being reloaded. If so keep current board active in sidebar
  // const [selected, setSelected] = useState(currentBoard == null ? boardNames[0] : currentBoard)
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);

  useEffect(() => {
    // Checks if system them is dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkTheme(true)
    }
    // Removes scrollbar when modal open
    if (showAddBoardModal) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  }, [showAddBoardModal])

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.main}>
      {showAddBoardModal && (
        <CreateBoard setShowAddBoardModal={setShowAddBoardModal} setCurrentBoard={setCurrentBoard} />
      )}

      <div className={styles.btnContainer}>
        {/* Activates sidebar */}
        <div className={styles.sidebarBtn} onClick={() => {
          setActive(!active)
          setSidebarExpanded(!sidebarExpanded)
        }}>
          <Image
            src='/assets/icon-show-sidebar.svg'
            height={11}
            width={16}
            alt='show sidebar button'
            />
        </div>
      </div>

      <div className={active ? `sidebar ${styles.sideNav} ${styles.activeSideNav}` : `${styles.sideNav} ${styles.collapsedSideNav}`}>
        <div className={`sidebar ${styles.logo}`}>
          {theme === 'system' && isDarkTheme || theme === 'dark' ? (
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

        <div className={styles.sidebarNavItemsContainer}>
          <span className={`heading-s ${styles.navItemsHeader}`}>ALL BOARDS ({boardNames.length})</span>

          {boardNames.map((boardName) => {
            const capitalizedBoardName = () => {
              if (!boardName.includes(' ')) {
                const capitalizedWords = [];
                const words = boardName.split(' ')
                words.forEach((word) => {
                  capitalizedWords.push(word[0].toUpperCase() + word.slice(1))
                })
                return capitalizedWords.join(' ');
              } else return boardName[0].toUpperCase() + boardName.slice(1);
            }

            return (
              <div key={boardName} onClick={() => {
                setCurrentBoard(boardName)
              }}>
                <Link
                key={boardName}
                href={{
                  pathname: `/${boardName.split(' ').join('-')}`,
                  query: { board: boardName }
                }}
                style={{ textDecoration: 'none'}}
                >
                  <div
                  className={`${boardName === currentBoard ? `${styles.selected} btn-primary` : ''} ${styles.navItem}`}
                  >
                    <Image
                      src='/assets/icon-board.svg'
                      height={16}
                      width={16}
                      alt='board link'
                    />
                    <span className='body-l'>{capitalizedBoardName()}</span>
                  </div>
                </Link>
              </div>

            )
          })}
            <div id={styles.createBoardBtn} className={`${styles.selected} ${styles.navItem}`} onClick={() => setShowAddBoardModal(true)}>
              <Image
                src='/assets/icon-board.svg'
                height={16}
                width={16}
                alt='board link'
              />
              <span className='body-l'>+ Create New Board</span>
            </div>
        </div>

        <div className={styles.sidebarActions}>
          <DarkModeToggle />
          <div className={styles.hideSidebarToggle} onClick={() => {
            setActive(!active)
            setSidebarExpanded(!sidebarExpanded)
          } }>
            <div className={styles.hideSidebarBtn}>
              <Image
              src='/assets/icon-hide-sidebar.svg'
              height={16}
              width={18}
              alt='hide sidebar icon'
              />
              <span className='body-l'>Hide Sidebar</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
