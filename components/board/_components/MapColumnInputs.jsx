import React from 'react'

import styles from './mapColumnInputs.module.scss'

import Image from 'next/image';

function MapColumnInputs({ columnNames, setColumnNames }) {
  const handleUpdateColumns = (index, value) => {
    setColumnNames(prevColumns => {
      const updatedColumns = [...prevColumns];
      updatedColumns[index] = value;
      return updatedColumns;
    });
  };

  const handleRemoveColumn = (index) => {
    const tempColumnNames = [...columnNames];
    tempColumnNames.splice(index, 1)
    setColumnNames([...tempColumnNames])
  }

  return (
    <>
      {columnNames.map((name, index) => {
        return (
          <div key={index} className={styles.statusRow}>
            <input
              type='text'
              id={index}
              name='columnNames'
              value={name}
              onChange={(e) => handleUpdateColumns(index, e.target.value)}
            />

            <div className={styles.deleteButton} onClick={(e) => handleRemoveColumn(e, index)}>
              <Image
              src='/assets/icon-cross.svg'
              height={15}
              width={15}
              alt='delete column button'
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default MapColumnInputs
