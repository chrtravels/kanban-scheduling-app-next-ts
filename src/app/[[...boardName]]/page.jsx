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


async function generateStaticParams() {
  const boards = await getData();
  const params = [];

  Object.keys(boards[0]).forEach((key) => {
    if (!params.includes(key)) {
      params.push(key.split(' ').join('-'));
    }
  })

  return params;
}

generateStaticParams();

export default async function Home({ params }) {
  let boardName = params.boardName ? params.boardName[0].replace(/%20/g, " "): '';

  const boards = await getData();

  if (!boardName) {
    console.log('test')
    if (boards[0].board_name.includes(' ')) {
      redirect(`/${boards[0].board_name.split(' ').join('-')}`)
    } else redirect(`/${boards[0].board_name.replace(/%20/g, " ")}`)
  } else if (boardName.includes(' ')) {
    redirect(`/${boardName.split(' ').join('-')}`)
  }

  return (
    <main className={styles.main}>
      <BoardLayout boards={boards} UrlBoardName={boardName} />
    </main>
  )
}
