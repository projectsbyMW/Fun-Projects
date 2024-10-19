import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newStatus, setNewStatus] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [policyStatus, setPolicyStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentResponse = await axios.get('http://localhost:5000/documents');
        setDocuments(documentResponse.data);
        const employeeResponse = await axios.get('http://localhost:5000/employees');
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDocumentStatusUpdate = async (id) => {
    try {
      const statusToUpdate = newStatus[id];
      const reason = rejectionReasons[id] || '';
      await axios.put(`http://localhost:5000/documents/${id}`, { status: statusToUpdate, rejectionReason: reason });
      setDocuments(prevDocs => prevDocs.map(doc => (doc._id === id ? { ...doc, status: statusToUpdate, rejectionReason: reason } : doc)));
      setNewStatus(prev => ({ ...prev, [id]: '' }));
      setRejectionReasons(prev => ({ ...prev, [id]: '' }));
      alert('Status Updated.')
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const handlePolicyApproval = async (employeeId) => {
    try {
      await axios.put(`http://localhost:5000/employees/${employeeId}/policy`, { policyStatus });
      setEmployees(prevEmployees =>
        prevEmployees.map(emp => (emp._id === employeeId ? { ...emp, policyStatus } : emp))
      );
      setPolicyStatus('');
    } catch (error) {
      console.error('Error updating policy status:', error);
    }
  };

  return (
    <div style={styles.adminContainer}>
      <h1 style={styles.heading}>Admin Page - Document & Policy Management</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Document Type</th>
            <th>Document URL</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.userId?.name || 'Unknown'}</td>
              <td>{doc.documentType}</td>
              <td>
                <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>View Document</a>
              </td>
              <td>{doc.status}</td>
              <td style={styles.actionCell}>
                <select
                  value={newStatus[doc._id] || doc.status}
                  onChange={(e) => setNewStatus({ ...newStatus, [doc._id]: e.target.value })}
                  style={styles.select}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={() => handleDocumentStatusUpdate(doc._id)}
                  style={styles.button}
                >
                  Update
                </button>
                {newStatus[doc._id] === 'Rejected' && (
                  <input
                    type="text"
                    placeholder="Rejection Reason"
                    value={rejectionReasons[doc._id] || ''}
                    onChange={(e) => setRejectionReasons({ ...rejectionReasons, [doc._id]: e.target.value })}
                    style={styles.input}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={styles.heading}>Policy Approval Section</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>KYC Status</th>
            <th>Document Status</th>
            <th>Policy Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.kycStatus}</td>
              <td>{employee.docStatus}</td>
              <td>{employee.policyStatus || 'Pending'}</td>
              <td style={styles.actionCell}>
                {employee.kycStatus === 'Approved' && employee.docStatus === 'Approved' && (
                  <>
                    <select
                      value={policyStatus}
                      onChange={(e) => setPolicyStatus(e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Select Status</option>
                      <option value="Approved">Approve Policy</option>
                      <option value="Rejected">Reject Policy</option>
                    </select>
                    <button
                      onClick={() => handlePolicyApproval(employee._id)}
                      style={styles.button}
                    >
                      Update
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  adminContainer: {
    padding: '20px',
    fontFamily: "'Montserrat', sans-serif",
    backgroundColor: '#1c1c1c',
    color: '#f4f4f4',
  },
  heading: {
    fontSize: '28px',
    color: '#ff9800',
    marginBottom: '20px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginBottom: '40px',
    borderCollapse: 'collapse',
    backgroundColor: '#2d2d2d',
  },
  actionCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ff9800',
    backgroundColor: '#333',
    color: '#f4f4f4',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  input: {
    padding: '8px',
    marginLeft: '10px',
    backgroundColor: '#333',
    color: '#f4f4f4',
    border: '1px solid #ff9800',
    borderRadius: '5px',
  },
  link: {
    color: '#ff9800',
    textDecoration: 'none',
  },
}

export default Admin;