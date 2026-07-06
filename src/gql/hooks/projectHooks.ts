import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import {
  DELETE_PROJECT,
  GET_PROJECT,
  GET_PROJECTS,
  buildCreateProject,
  buildUpdateProject,
} from '../queries/projects';
import type { Project } from '../../types/projectMgr';

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['get-projects'],
    queryFn: () =>
      gqlRequest<{ getProjects: Project[] }>(GET_PROJECTS).then((data) => data.getProjects),
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ['get-project', id],
    queryFn: () =>
      gqlRequest<{ getProject: Project }>(GET_PROJECT, { id }).then((data) => data.getProject),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, ...rest }: Omit<Project, 'id'>) => {
      const query = buildCreateProject(status);
      return gqlRequest<{ createProject: Project }>(query, rest).then((data) => data.createProject);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-projects'] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, ...rest }: Partial<Project> & { id: string }) => {
      const query = buildUpdateProject(status);
      return gqlRequest<{ updateProject: Project }>(query, { id, ...rest }).then(
        (data) => data.updateProject,
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-projects'] });
      queryClient.setQueryData(['get-project', data.id], data);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      gqlRequest<{ deleteProject: { deletedCount: number } }>(DELETE_PROJECT, { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-projects'] }),
  });
};
