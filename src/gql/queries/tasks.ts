const TASK_FIELDS = `
  id
  projectId
  name
  description
  status
  dueDate
`;

export const GET_TASKS_BY_PROJECT = `
  query GetTasksByProject($id: String!) {
    getTasksByProject(id: $id) {
      ${TASK_FIELDS}
    }
  }
`;

export const CREATE_TASK = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ${TASK_FIELDS}
    }
  }
`;

export const UPDATE_TASK = `
  mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
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
