import conn from '../../../../lib/db';

export async function PATCH(request: Request) {
  try {
    const query = 'SELECT * FROM boards'
    const result = await conn.query(
      query
    )
    return Response.json(result.rows);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export async function DELETE(request: Request) {
  try {
    const query = 'SELECT * FROM boards'
    const result = await conn.query(
      query
    )
    return Response.json(result.rows);
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}
