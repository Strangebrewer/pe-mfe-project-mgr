const TASK_FIELDS = `
  id
  projectId
  name
  description
  status
  dueDate
`;

export const GET_TASKS_BY_PROJECT = `
  query GetTasksByProject($projectId: String!) {
    getTasksByProject(projectId: $projectId) {
      ${TASK_FIELDS}
    }
  }
`;

export const CREATE_TASK = `
  mutation CreateTask(
    $projectId: String!
    $name: String!
    $description: String
    $status: TaskStatus
    $dueDate: String
  ) {
    createTask(
      projectId: $projectId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      ${TASK_FIELDS}
    }
  }
`;

export const UPDATE_TASK = `
  mutation UpdateTask(
    $id: String!
    $name: String
    $description: String
    $status: TaskStatus
    $dueDate: String
  ) {
    updateTask(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      ${TASK_FIELDS}
    }
  }
`;

export const DELETE_TASK = `
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id) {
      deletedCount
    }
  }
`;
