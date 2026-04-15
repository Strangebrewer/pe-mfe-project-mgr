import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetProjects } from './gql/hooks/projectHooks';
import './index.css';

function ProjectList() {
  const { data: projects, isPending, isError } = useGetProjects();

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Failed to load projects.</div>;

  return (
    <div>
      <h1>Projects</h1>
      {projects?.length === 0 && <p>No projects yet.</p>}
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}

function NotFound() {
  return <div>Not found.</div>;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
