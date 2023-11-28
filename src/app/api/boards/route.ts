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
  const status = body[1];

  try {
    const query = 'INSERT INTO boards (board_name = $1, status = $2, tasks = $3';
    const values = [boardName, status, []];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to create board')
  }
}
