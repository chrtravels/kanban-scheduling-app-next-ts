import { NextResponse } from "next/server";
import conn from '../../../../lib/db';
import { NextRequest } from 'next/server.js';

// type request = {
//   databaseId: number,
//   boardName: string,
//   boardStatus: string,
//   tasks: [{title: string, status: string, subtasks: [{title: string, isCompleted: boolean}]}]
// }

export async function PATCH(request: Request) {
  const body = await request.json()

  const databaseId = body[0];
  const boardStatus = body[1];
  const updatedTasks = body[2];

  try {
    const query = 'Update boards SET status = $1, tasks = $2 WHERE id = $3';
    const values = [boardStatus, JSON.stringify(updatedTasks), databaseId];
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
