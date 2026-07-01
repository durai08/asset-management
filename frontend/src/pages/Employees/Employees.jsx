import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employeeService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const emptyForm = { emp_code: '', name: '', department: '', designation: '', email: '', phone: '' };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setForm({ emp_code: emp.emp_code, name: emp.name, department: emp.department || '', designation: emp.designation || '', email: emp.email || '', phone: emp.phone || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateEmployee(editing.id, form);
        toast.success('Employee updated');
      } else {
        await createEmployee(form);
        toast.success('Employee created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    { key: 'emp_code', label: 'Code', accessor: 'emp_code' },
    { key: 'name', label: 'Name', accessor: 'name' },
    { key: 'department', label: 'Department', accessor: 'department' },
    { key: 'designation', label: 'Designation', accessor: 'designation' },
    { key: 'email', label: 'Email', accessor: 'email' },
    { key: 'phone', label: 'Phone', accessor: 'phone' },
    {
      key: 'status', label: 'Status', noSort: true,
      render: (row) => (
        <span className={`badge ${row.is_active ? 'badge-active' : 'badge-inactive'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', noSort: true,
      render: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => openEdit(row)} title="Edit"><HiOutlinePencil /></button>
          <button className="btn-icon danger" onClick={() => handleDelete(row.id)} title="Delete"><HiOutlineTrash /></button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Employees</h1>
          <p>Manage your organization's employees</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Add Employee
        </button>
      </div>

      <Table
        title={`All Employees (${employees.length})`}
        columns={columns}
        data={employees}
        emptyMessage="No employees found"
        emptyIcon="👥"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Employee' : 'Add Employee'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Employee Code *</label>
              <input className="form-input" required value={form.emp_code} onChange={e => setForm({ ...form, emp_code: e.target.value })} placeholder="EMP-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input className="form-input" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="Software Engineer" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
