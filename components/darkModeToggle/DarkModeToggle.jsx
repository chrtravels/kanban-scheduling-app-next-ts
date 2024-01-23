"use client"

import Image from 'next/image';
import Switch from 'react-switch';
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react';

import styles from './darkModeToggle.module.scss'

export const DarkModeToggle = () => {
  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState (false)


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.lightBackground : styles.darkBackground}`}>
      <Image
        src='/assets/icon-light-theme.svg'
        height={19}
        width={19}
        alt='light mode'
        />
      <Switch
      checked={theme === 'dark'}
      onChange={(e) => setTheme(theme === 'dark' ? 'light' : 'dark')}
      uncheckedIcon={false}
      checkedIcon={false}
      onColor="#635fc7"
      offColor="#635fc7"
      aria-label="Dark mode toggle"
      />
      <Image
        src='/assets/icon-dark-theme.svg'
        height={19}
        width={19}
        alt='dark mode'
        />
    </div>
  );
};
