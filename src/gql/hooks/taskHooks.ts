import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gqlRequest } from "../../utils/graphqlClient";
import {
  DELETE_TASK,
  GET_TASKS_BY_PROJECT,
  buildCreateTask,
  buildUpdateTask,
} from "../queries/tasks";
import type { Task } from "../../types/projectMgr";

export const useGetTasksByProject = (id: string) => {
  return useQuery({
    queryKey: ["get-tasks", id],
    queryFn: () =>
      gqlRequest<{ getTasksByProject: Task[] }>(GET_TASKS_BY_PROJECT, {
        id,
      }).then((data) => data.getTasksByProject),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, ...rest }: Omit<Task, "id">) => {
      const query = buildCreateTask(status);
      return gqlRequest<{ createTask: Task }>(query, rest).then(
        (data) => data.createTask,
      );
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: ["get-tasks", data.projectId],
      }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId, status, ...rest }: Partial<Task> & { id: string; projectId?: string }) => {
      const query = buildUpdateTask(status);
      return gqlRequest<{ updateTask: Task }>(query, { id, ...rest }).then(
        (data) => data.updateTask,
      );
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: ["get-tasks", data.projectId],
      }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      gqlRequest<{ deleteTask: { deletedCount: number } }>(DELETE_TASK, {
        id,
      }).then((res) => ({
        ...res,
        projectId,
      })),
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: ["get-tasks", data.projectId],
      }),
  });
};
