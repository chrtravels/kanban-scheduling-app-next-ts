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
  // [key: string]: any[]
  id: number,
  board_name: string,
  columns: [{}]
}

type Params = {
  params: {
    boardName: string
  };
}

// Sort data into separate boards
// async function getBoards() {
//   const boards: Board = {};
//   const getBoards = await getData()

//   getBoards.forEach((board:{id: number, board_name: string}) => {
//     const boardName: string = board.board_name;
//     // INCLUDE THE ORIGINAL DATABASE ENTRY ID WITH EACH ENTRY TO boards
//     if (boards[boardName]) {
//       boards[boardName] = [...boards[boardName], {'db_id': board.id, 'status': board.status, 'tasks': board.tasks}]
//     } else {
//       boards[boardName] = [{'db_id': board.id, 'status': board.status, 'tasks': board.tasks}]
//     }
//   })

//   return boards;
// }

async function generateStaticParams() {
  const boards = await getData();
  const params: string[] = [];

  Object.keys(boards[0]).forEach((key) => {
    if (!params.includes(key)) {
      params.push(key.split(' ').join('-'));
    }
  })

  return params;
}

generateStaticParams();

export default async function Home({ params: { boardName } }: Params) {
  const boards = await getData();

  if (!boardName) {
    if (boards[0].board_name.includes(' ')) {
      redirect(`/${boards[0].board_name.split(' ').join('-')}`)
    } else redirect(`/${boards[0].board_name.replace(/%20/g, " ")}`)
  }

  const UrlBoardName = boardName[0].replace(/%20/g, " ")

  return (
    <main className={styles.main}>
      <BoardLayout boards={boards} UrlBoardName={UrlBoardName} />
    </main>
  )
}
