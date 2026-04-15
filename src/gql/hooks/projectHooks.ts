import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import { GET_PROJECTS } from '../queries/projects';
import type { Project } from '../../types/projectMgr';

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['get-projects'],
    queryFn: () => gqlRequest(GET_PROJECTS).then((data) => data.getProjects as Project[]),
  });
};
