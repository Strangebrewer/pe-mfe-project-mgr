export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Project = {
  id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  dueDate?: string;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
};
