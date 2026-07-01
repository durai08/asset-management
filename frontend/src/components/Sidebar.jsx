import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineArrowCircleRight,
  HiOutlineArrowCircleLeft,
  HiOutlineClipboardList,
  HiOutlineMenuAlt2,
  HiOutlineChevronLeft,
} from 'react-icons/hi';

const navItems = [
  { label: 'Overview', section: true },
  { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { label: 'Management', section: true },
  { path: '/employees', label: 'Employees', icon: HiOutlineUsers },
  { path: '/categories', label: 'Categories', icon: HiOutlineTag },
  { path: '/assets', label: 'Assets', icon: HiOutlineCube },
  { path: '/stock', label: 'Stock View', icon: HiOutlineArchive },
  { label: 'Transactions', section: true },
  { path: '/issue', label: 'Issue Asset', icon: HiOutlineArrowCircleRight },
  { path: '/return', label: 'Return Asset', icon: HiOutlineArrowCircleLeft },
  { path: '/history', label: 'History', icon: HiOutlineClipboardList },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">AssetPro</span>
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <HiOutlineMenuAlt2 /> : <HiOutlineChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div className="nav-section-label" key={`section-${idx}`}>
                {item.label}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <Icon className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
