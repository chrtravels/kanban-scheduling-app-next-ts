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
