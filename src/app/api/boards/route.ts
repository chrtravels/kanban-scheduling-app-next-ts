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

  const boardName = body[0];
  const columns = body[1];
  console.log('board name: ', boardName)
  console.log('columns: ', columns)
  try {
    // const query = 'INSERT INTO boards (board_name = $1, status = $2, tasks = $3';
    // const values = [boardName, statusName, []];
    // const query = `INSERT INTO boards (board_name, status) VALUES (${boardName}, ${statusName})`;
    // const query = `INSERT INTO boards (board_name, columns) VALUES ('${boardName}, ${columns}')`;
    const query = `INSERT INTO boards (board_name, columns) VALUES ('${boardName}', '${JSON.stringify(columns)}')`;
    const result = await conn.query(query);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to create board')
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()

  const boardName = body[0];
  const columns = body[1];

  try {
    const query = 'Update boards SET columns = $1 WHERE board_name = $2';
    const values = [JSON.stringify(columns), boardName];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update task')
  }
}
