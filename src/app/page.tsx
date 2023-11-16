import Image from 'next/image'
import styles from './page.module.css'

import conn from '../../lib/db'

async function getData() {
  try {
    const query = 'SELECT * FROM boards'
    const result = await conn.query(
      query
    )
    return result.rows;
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

type Board = {
  [key: string]: any[]
}

export default async function Home() {
  const boards: Board = {};
  const getBoards = await getData()

  getBoards.forEach((board:{board_name: string, status: string, tasks: []}) => {
    const boardName: string = board.board_name;

    if (boards[boardName]) {
      boards[boardName] = [...boards[boardName], {'status': board.status, 'tasks': board.tasks}]
    } else {
      boards[boardName] = [{'status': board.status, 'tasks': board.tasks}]
    }
  })

  console.log('boards: ', boards)

  return (
    <main className={styles.main}>
      <h1>Home Page</h1>
    </main>
  )
}
