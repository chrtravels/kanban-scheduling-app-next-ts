import Image from 'next/image'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

import conn from '../../../lib/db'
import BoardLayout from '../../../components/board/BoardLayout';

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
// CHANGE TO INCLUDE THE ORIGINAL DATABASE ENTRY ID WITH EACH ENTRY TO boards
// Sort data into separate boards
async function getBoards() {
  const boards: Board = {};
  const getBoards = await getData()

  getBoards.forEach((board:{id: number, board_name: string, status: string, tasks: []}) => {
    const boardName: string = board.board_name;

    if (boards[boardName]) {
      boards[boardName] = [...boards[boardName], {'db_id': board.id, 'status': board.status, 'tasks': board.tasks}]
    } else {
      boards[boardName] = [{'db_id': board.id, 'status': board.status, 'tasks': board.tasks}]
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

  return params;
}

generateStaticParams();

export default async function Home({ params: { boardName } }: Params) {
  const boards = await getBoards();

  if (!boardName) {
    if (Object.keys(boards)[0].includes(' ')) {
      redirect(`/${Object.keys(boards)[0].split(' ').join('-')}`)
    } else redirect(`/${Object.keys(boards)[0].replace(/%20/g, " ")}`)
  }

  const verifiedBoardName = boardName[0].replace(/%20/g, " ")

  return (
    <main className={styles.main}>
      <BoardLayout boards={boards} boardName={verifiedBoardName} />
    </main>
  )
}
