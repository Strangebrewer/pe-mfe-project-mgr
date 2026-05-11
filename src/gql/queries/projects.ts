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

export const CREATE_PROJECT = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ${PROJECT_FIELDS}
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      ${PROJECT_FIELDS}
    }
  }
`;

export const DELETE_PROJECT = `
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      deletedCount
    }
  }
`;
