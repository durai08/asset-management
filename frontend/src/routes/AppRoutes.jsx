import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees/Employees';
import Categories from '../pages/Categories/Categories';
import Assets from '../pages/Assets/Assets';
import Stock from '../pages/Stock/Stock';
import Issue from '../pages/Issue/Issue';
import Return from '../pages/Return/Return';
import History from '../pages/History/History';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/issue" element={<Issue />} />
        <Route path="/return" element={<Return />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}
