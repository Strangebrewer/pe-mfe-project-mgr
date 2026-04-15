export const GET_PROJECTS = `
  query GetProjects {
    getProjects {
      id
      name
      description
      status
      dueDate
    }
  }
`;
