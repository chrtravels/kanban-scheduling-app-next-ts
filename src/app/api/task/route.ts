import { NextRequest, NextResponse } from "next/server";
import conn from '../../../../lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const boardName = url.searchParams.get('boardName');

  try {
    const query = 'SELECT * FROM boards where board_name = $1'
    const values = [boardName]
    const result = await conn.query(query, values)
    return NextResponse.json(result.rows);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const boardName = body[0];
  const updatedColumns = body[1];

  try {
    const query = 'Update boards SET columns = $1 WHERE board_name = $2';
    const values = [JSON.stringify(updatedColumns), boardName];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update tasks')
  }
}
