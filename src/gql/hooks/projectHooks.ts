import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT,
  GET_PROJECTS,
  UPDATE_PROJECT,
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
    mutationFn: (variables: Omit<Project, 'id'>) =>
      gqlRequest<{ createProject: Project }>(CREATE_PROJECT, variables).then(
        (data) => data.createProject,
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-projects'] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Partial<Project> & { id: string }) =>
      gqlRequest<{ updateProject: Project }>(UPDATE_PROJECT, variables).then(
        (data) => data.updateProject,
      ),
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
