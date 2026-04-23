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
  mutation CreateProject(
    $name: String!
    $description: String
    $status: ProjectStatus
    $dueDate: String
  ) {
    createProject(
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      ${PROJECT_FIELDS}
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject(
    $id: String!
    $name: String
    $description: String
    $status: ProjectStatus
    $dueDate: String
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
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
