import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function DocumentationManager() {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        url: '',
        name: '',
        isPublic: false,
    });
    const [editingDocument, setEditingDocument] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get('/documentation/all');
                if (response?.data) {
                    setDocuments(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch documents:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch all documents';
                setError(errorMessage);
            }
        };
        fetchDocuments();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            url: '',
            name: '',
            isPublic: false,
        });
        setEditingDocument(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.url || !formData.name) {
            setError('URL and name are required');
            return;
        }
        if (formData.url.length > 255) {
            setError('URL must be 255 characters or less');
            return;
        }
        if (formData.name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }

        try {
            const payload = {
                url: formData.url,
                name: formData.name,
                isPublic: formData.isPublic,
            };
            if (editingDocument) {
                const response = await api.patch(`/documentation/${editingDocument.id}`, payload);
                setDocuments(
                    documents.map((doc) => (doc.id === editingDocument.id ? response.data.document : doc))
                );
                alert('Document updated successfully');
            } else {
                const response = await api.post('/documentation', payload);
                setDocuments([...documents, response.data.document]);
                alert('Document created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save document:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save document';
            setError(errorMessage);
        }
    };

    const startEditing = (document) => {
        setEditingDocument(document);
        setFormData({
            url: document.url,
            name: document.name,
            isPublic: document.isPublic,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`/documentation/${id}`);
                setDocuments(documents.filter((doc) => doc.id !== id));
                alert('Document deleted successfully');
            } catch (error) {
                console.error('Failed to delete document:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete document';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Documentation Manager</h2>
            <Role has="DOC_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Document'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="document-form">
                        <h3>{editingDocument ? 'Edit Document' : 'Create Document'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>URL:</label>
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter document URL (max 255 characters)"
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter document name (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        checked={formData.isPublic}
                                        onChange={handleInputChange}
                                    />
                                    Public
                                </label>
                            </div>
                            <button type="submit" className="btn">
                                {editingDocument ? 'Update Document' : 'Create Document'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Name</th>
                            <th>URL</th>
                            <th>Public</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {documents.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="7">No documents found.</td>
                            </tr>
                        ) : (
                            documents.map((doc, index) => (
                                <tr key={index} className="background-change">
                                    <td>{doc.id}</td>
                                    <td>{doc.name}</td>
                                    <td>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            {doc.url}
                                        </a>
                                    </td>
                                    <td>{doc.isPublic ? 'Yes' : 'No'}</td>
                                    <td>{new Date(doc.createdAt).toLocaleString()}</td>
                                    <td>{new Date(doc.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(doc)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(doc.id)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Role>
        </div>
    );
}