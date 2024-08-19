import React from 'react'

import styles from '../addTask.module.scss'

import Image from 'next/image';

function SubtasksInput({ subtasks, setSubtasks }) {
  const handleUpdateSubtasks = (index, value) => {
    setSubtasks(prevSubtasks => {
      const updatedSubtasks = [...prevSubtasks];
      updatedSubtasks[index] = { ...updatedSubtasks[index], title: value};
      return updatedSubtasks;
    });
  };

  const handleRemoveSubtask = (index) => {
    const tempSubtasks = [...subtasks];
    tempSubtasks.splice(index, 1)
    setSubtasks([...tempSubtasks])
  }

  return (
    <>
      {subtasks.map((subtask, index) => {
        return (
          <div key={index} className={styles.subtaskRow}>
            <input
              type='text'
              id={index}
              name='subtask'
              value={subtask.title}
              onChange={(e) => handleUpdateSubtasks(index, e.target.value)}
            />

            <div className={styles.deleteButton} onClick={(e) => handleRemoveSubtask(index)}>
              <Image
              src='/assets/icon-cross.svg'
              height={15}
              width={15}
              alt='delete subtask button'
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default SubtasksInput
