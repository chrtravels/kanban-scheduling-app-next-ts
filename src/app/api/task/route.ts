import { NextResponse } from "next/server";
import conn from '../../../../lib/db';
import { NextRequest } from 'next/server.js';

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

// Updates existing database entry with a specific id
export async function PATCH(request: Request) {
  const body = await request.json()
  console.log('body: ', body)
  const boardName = body[0];
  const updatedColumns = body[1];

  try {
    const query = 'Update boards SET columns = $1 WHERE board_name = $2';
    const values = [JSON.stringify(updatedColumns), boardName];
    const result = await conn.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update task')
  }
}

export async function DELETE(request: Request) {
  try {
    const query = 'DELETE * FROM boards'
    const result = await conn.query(
      query
    )
    return NextResponse.json(result.rows);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}
