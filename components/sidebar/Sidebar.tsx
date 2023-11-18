'use client'

import styles from './sidebar.module.scss'

import { useTheme } from 'next-themes'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import BoardIcon from '../../public/assets/icon-board.svg';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { DarkModeToggle } from '../darkModeToggle/DarkModeToggle';

type Props = {
  boardNames: string[];
  boardCount: number;
  sidebarExpanded: Boolean;
  setSidebarExpanded: Dispatch<SetStateAction<Boolean>>;
}

export default function Sidebar({ boardNames, boardCount, sidebarExpanded, setSidebarExpanded}: Props) {
  const { theme, setTheme} = useTheme();
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState('platform launch')

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.main}>
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

        <div className={styles.sidebarNavItemsContainer}>
          <span className={`heading-s ${styles.navItemsHeader}`}>ALL BOARDS ({boardCount})</span>

          {boardNames.map((boardName) => {
            const capitalizedBoardName = () => {
              if (!boardName.includes(' ')) {
                const capitalizedWords: string[] = [];
                const words = boardName.split(' ')
                words.forEach((word) => {
                  capitalizedWords.push(word[0].toUpperCase() + word.slice(1))
                })
                return capitalizedWords.join(' ');
              } else return boardName[0].toUpperCase() + boardName.slice(1);
            }
            console.log('boardName: ', boardName)
            return (
              <Link
              key={boardName}
              href={{
                pathname: `/${boardName.split(' ').join('-')}`,
                // query: { board: boardName }
              }}
              style={{ textDecoration: 'none'}}
              >
                <div className={`${boardName === selected ? `${styles.selected} btn-primary` : ''} ${styles.navItem}`} onClick={() => setSelected(boardName)}>
                  <Image
                    src='/assets/icon-board.svg'
                    height={16}
                    width={16}
                    alt='board link'
                  />
                  <span className='body-l'>{capitalizedBoardName()}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className={styles.sidebarActions}>
          <DarkModeToggle />
          <div className={styles.hideSidebarToggle} onClick={() => {
            setActive(!active)
            setSidebarExpanded(!sidebarExpanded)
          } }>
          </div>
          <div className={styles.hideSidebarBtn}>
            <AiOutlineEyeInvisible />
            <span className='body-m'>Hide Sidebar</span>
          </div>
        </div>
      </div>
    </div>

  );
}
