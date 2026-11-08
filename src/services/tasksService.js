
import { mockTasks } from "../data/mockTasks";

const PRIORITY_FROM_API = {
  High: "Высокий",
  Medium: "Средний",
  Low: "Низкий",
};

function mapApiTaskToUi(task) {
  return {
    ...task,
    priority:
      PRIORITY_FROM_API[task.priority] ||
      task.priority ||
      "Средний",
  };
}

export function groupTasksByStatus(tasks = []) {
  const grouped = {
    todo: [],
    inProgress: [],
    review: [],
    done: [],
  };

  for (const rawTask of tasks) {
    const task = mapApiTaskToUi(rawTask);
    const status = grouped[task.status]
      ? task.status
      : "todo";

    const { status: _status, ...taskData } = task;
    grouped[status].push(taskData);
  }

  return grouped;
}

export async function getTasks() {
  return groupTasksByStatus(mockTasks);
}
