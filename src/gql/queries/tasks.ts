import { TaskStatus } from '../../types/projectMgr';

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

export const buildCreateTask = (status?: TaskStatus) => {
  const statusField = status ? `, status: ${status}` : '';
  return `
    mutation CreateTask($projectId: String!, $name: String!, $description: String, $dueDate: String) {
      createTask(input: { projectId: $projectId, name: $name${statusField}, description: $description, dueDate: $dueDate }) {
        ${TASK_FIELDS}
      }
    }
  `;
};

export const buildUpdateTask = (status?: TaskStatus) => {
  const statusField = status ? `status: ${status}, ` : '';
  return `
    mutation UpdateTask($id: String!, $name: String, $description: String, $dueDate: String) {
      updateTask(id: $id, input: { ${statusField}name: $name, description: $description, dueDate: $dueDate }) {
        ${TASK_FIELDS}
      }
    }
  `;
};

export const DELETE_TASK = `
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id) {
      deletedCount
    }
  }
`;
