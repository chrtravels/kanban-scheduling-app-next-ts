import conn from '../../../../lib/db';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = 'SELECT * FROM boards'
    const result = await conn.query(
      query
    )
    return NextResponse.json(result.rows);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  const boardName = body[0]; // result is 'Test
  const statusName = body[1]; // result is 'col1'

  try {
    // const query = 'INSERT INTO boards (board_name = $1, status = $2, tasks = $3';
    // const values = [boardName, statusName, []];
    // const query = `INSERT INTO boards (board_name, status) VALUES (${boardName}, ${statusName})`;
    const query = `INSERT INTO boards (board_name, status) VALUES ('${boardName}', '${statusName}')`;
    console.log('query: ', query)
    const result = await conn.query(query);
    console.log('result: ', result)
    return NextResponse.json(result);
  } catch (error) {
    console.log(error)
    throw new Error('Failed to create board')
  }
}
