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

  try {
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
  const id = body[2]

  try {
    const query = 'Update boards SET board_name = $1, columns = $2 WHERE id = $3';
    const values = [boardName, JSON.stringify(columns), id];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update task')
  }
}

export async function DELETE(request: Request) {
  const body = await request.json()

  const id = body[0]
  console.log('id: ', id)
  try {
    const query = 'DELETE FROM boards WHERE id = $3';
    const values = [id];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update task')
  }
}
