import { NextResponse } from "next/server";
import conn from '../../../../lib/db';

type Board = {
  db_id: number,
  boardName: string,
  status: string,
  tasks: [{title: string, status: string, subtasks: [{title: string, isCompleted: boolean}]}]
}

export async function PATCH(board: Board) {
  const {db_id, boardName, status, tasks} = board

  try {
    const query = 'Update boards SET board_name = $1, status = $2, tasks = $3 WHERE id = $4';
    const values = [boardName, status, tasks, db_id]
    const result = await conn.query(query, values)
    return NextResponse.json(result);
  } catch (error) {
    throw new Error('Failed to update task')
  }
}

export async function DELETE(request: Request) {
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
