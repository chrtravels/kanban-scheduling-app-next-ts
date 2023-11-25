export const handleUpdateBoard = async (databaseId, boardStatus, tasks) => {
  const updatedTasks = [...tasks];
  updatedTasks[taskId] = currentTask;

  const options = {
    method: 'PATCH',
    header: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify([databaseId, boardStatus, updatedTasks])
  }

  try {
    const res = await fetch('/api/task', options);
    const data = res.json();

    if (res.ok) {
      router.refresh();
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error updating task')
  }
}
