'use client'

import { useTheme } from 'next-themes'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './navbar.module.scss'


const Navbar = ({ sidebarExpanded }) => {
  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState (false)

  const contentStyle = {
    transition: "all 0.5s ease-in-out",
};


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }

  console.log('theme: ', theme)

  return (
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
        <div className={styles.addTaskBtn}>
        <button
          aria-label='Toggle Dark Mode'
          type='button'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
          {theme === 'dark' ? (
            'light'
          ) : (
            'dark'
          )}
        </button>
      </div>
    </div>
    </div>
  )
}

export default Navbar;
