import { ProjectStatus } from '../../types/projectMgr';

const PROJECT_FIELDS = `
  id
  name
  description
  status
  dueDate
`;

export const GET_PROJECTS = `
  query GetProjects {
    getProjects {
      ${PROJECT_FIELDS}
    }
  }
`;

export const GET_PROJECT = `
  query GetProject($id: String!) {
    getProject(id: $id) {
      ${PROJECT_FIELDS}
    }
  }
`;

export const buildCreateProject = (status?: ProjectStatus) => {
  const statusField = status ? `, status: ${status}` : '';
  return `
    mutation CreateProject($name: String!, $description: String, $dueDate: String) {
      createProject(input: { name: $name${statusField}, description: $description, dueDate: $dueDate }) {
        ${PROJECT_FIELDS}
      }
    }
  `;
};

export const buildUpdateProject = (status?: ProjectStatus) => {
  const statusField = status ? `status: ${status}, ` : '';
  return `
    mutation UpdateProject($id: String!, $name: String, $description: String, $dueDate: String) {
      updateProject(id: $id, input: { ${statusField}name: $name, description: $description, dueDate: $dueDate }) {
        ${PROJECT_FIELDS}
      }
    }
  `;
};

export const DELETE_PROJECT = `
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      deletedCount
    }
  }
`;
