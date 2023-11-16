import Image from 'next/image'
import styles from './page.module.css'

import conn from '../../../lib/db'

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

// Type Definitions:
type Board = {
  [key: string]: any[]
}

type Params = {
  params: {
    boardName: Array<string>;
  };
}

// Sort data into separate boards
async function getBoards() {
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

  return boards;
}

async function generateStaticParams() {
  const boards = await getBoards();
  const params: string[] = [];

  Object.keys(boards).forEach((key) => {
    if (!params.includes(key)) {
      params.push(key.split(' ').join('-'));
    }
  })
  console.log(params)
  return params;
}

generateStaticParams();

export default async function Home({ params: { boardName } }: Params) {
  const boards = await getBoards();

  console.log('boards: ', boards)

  return (
    <main className={styles.main}>
      <h1>Home Page</h1>
    </main>
  )
}
