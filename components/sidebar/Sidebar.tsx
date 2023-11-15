'use client'

import styles from './sidebar.module.scss'

import { useTheme } from 'next-themes'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { DarkModeToggle } from '../darkModeToggle/DarkModeToggle';

type Props = {
  sidebarExpanded: Boolean;
  setSidebarExpanded: Dispatch<SetStateAction<Boolean>>;
}


export default function Sidebar({ sidebarExpanded, setSidebarExpanded}: Props) {
  const { theme, setTheme} = useTheme();
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState (false)

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

        <div className={styles.sidebarActions}>
          <DarkModeToggle />
          <div className={styles.hideSidebarToggle} onClick={() => {
            setActive(!active)
            setSidebarExpanded(!sidebarExpanded)
          } }>
            <AiOutlineEyeInvisible />
            <span>Hide Sidebar</span>
          </div>
        </div>
      </div>
    </div>

  );
}
