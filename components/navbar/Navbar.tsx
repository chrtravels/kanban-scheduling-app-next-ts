'use client'

import { useTheme } from 'next-themes'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './navbar.module.scss'


const Navbar = () => {
  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState (false)


  useEffect(() => {
    setMounted(true);
  }, []);

  console.log('resolved theme: ', theme)
  if (!mounted) {
    return null
  }

  console.log('theme: ', useTheme())

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
        <div className={styles.boardName}><h2>Platform Launch</h2></div>
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
