import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStock } from '../../services/assetService';
import Loader from '../../components/Loader';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const res = await getStock();
      setStock(res.data);
    } catch (err) {
      toast.error('Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const totals = stock.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      available: acc.available + s.available,
      issued: acc.issued + s.issued,
      scrapped: acc.scrapped + s.scrapped,
    }),
    { total: 0, available: 0, issued: 0, scrapped: 0 }
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Stock View</h1>
          <p>Assets grouped by category with availability counts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card animate-in" style={{ '--card-accent': 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <div className="stat-card-label">Total Stock</div>
          <div className="stat-card-value">{totals.total}</div>
        </div>
        <div className="stat-card animate-in" style={{ '--card-accent': 'linear-gradient(135deg, #059669, #34d399)' }}>
          <div className="stat-card-label">Available</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-emerald)' }}>{totals.available}</div>
        </div>
        <div className="stat-card animate-in" style={{ '--card-accent': 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
          <div className="stat-card-label">Issued</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{totals.issued}</div>
        </div>
        <div className="stat-card animate-in" style={{ '--card-accent': 'linear-gradient(135deg, #dc2626, #fb7185)' }}>
          <div className="stat-card-label">Scrapped</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-rose)' }}>{totals.scrapped}</div>
        </div>
      </div>

      {stock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-text">No stock data. Add categories and assets first.</div>
        </div>
      ) : (
        <div className="stock-grid">
          {stock.map((cat, idx) => (
            <div className="stock-card animate-in" key={cat.categoryId} style={{ animationDelay: `${idx * 0.06}s` }}>
              <div className="stock-card-header">
                <span className="stock-card-title">{cat.category}</span>
                <span className="stock-card-total">{cat.total} items</span>
              </div>
              <div className="stock-card-body">
                <div className="stock-counts">
                  <div className="stock-count-item">
                    <div className="stock-count-value" style={{ color: 'var(--accent-emerald)' }}>{cat.available}</div>
                    <div className="stock-count-label">Available</div>
                  </div>
                  <div className="stock-count-item">
                    <div className="stock-count-value" style={{ color: 'var(--accent-amber)' }}>{cat.issued}</div>
                    <div className="stock-count-label">Issued</div>
                  </div>
                  <div className="stock-count-item">
                    <div className="stock-count-value" style={{ color: 'var(--accent-rose)' }}>{cat.scrapped}</div>
                    <div className="stock-count-label">Scrapped</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
