import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectDetail from './components/project-detail/ProjectDetail';
import ProjectList from './components/ProjectList';
import './index.css';

const App: FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path=":id" element={<ProjectDetail />} />
      <Route path="*" element={<div className="tw:p-6">Not found.</div>} />
    </Routes>
  );
};

export default App;
