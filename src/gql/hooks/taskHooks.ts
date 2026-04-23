import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import { CREATE_TASK, DELETE_TASK, GET_TASKS_BY_PROJECT, UPDATE_TASK } from '../queries/tasks';
import type { Task } from '../../types/projectMgr';

export const useGetTasksByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['get-tasks', projectId],
    queryFn: () =>
      gqlRequest<{ getTasksByProject: Task[] }>(GET_TASKS_BY_PROJECT, { projectId }).then(
        (data) => data.getTasksByProject,
      ),
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Omit<Task, 'id'>) =>
      gqlRequest<{ createTask: Task }>(CREATE_TASK, variables).then((data) => data.createTask),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ['get-tasks', data.projectId] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Partial<Task> & { id: string }) =>
      gqlRequest<{ updateTask: Task }>(UPDATE_TASK, variables).then((data) => data.updateTask),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ['get-tasks', data.projectId] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      gqlRequest<{ deleteTask: { deletedCount: number } }>(DELETE_TASK, { id }).then((res) => ({
        ...res,
        projectId,
      })),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ['get-tasks', data.projectId] }),
  });
};
