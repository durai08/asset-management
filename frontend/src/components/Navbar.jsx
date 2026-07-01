import { useLocation } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/categories': 'Categories',
  '/assets': 'Assets',
  '/stock': 'Stock View',
  '/issue': 'Issue Asset',
  '/return': 'Return Asset',
  '/history': 'History',
};

export default function Navbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'AssetPro';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <div className="page-title">{title}</div>
          <div className="breadcrumb">Home / {title}</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="user-avatar" title="Admin">A</div>
      </div>
    </header>
  );
}
