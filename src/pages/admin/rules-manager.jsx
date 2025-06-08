import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function RulesManager() {
    const [rules, setRules] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        lang: '',
        text: '',
    });
    const [editingRule, setEditingRule] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await api.get('/rules');
                if (response?.data) {
                    setRules(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch rules:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch rules';
                setError(errorMessage);
            }
        };
        fetchRules();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({ lang: '', text: '' });
        setEditingRule(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                lang: formData.lang,
                text: formData.text,
            };
            if (editingRule) {
                const response = await api.patch(`/rules/${editingRule.id}`, payload);
                setRules(rules.map((rule) => (rule.id === editingRule.id ? response.data.rule : rule)));
                alert('Rule updated successfully');
            } else {
                const response = await api.post('/rules', payload);
                setRules([response.data.rule, ...rules]);
                alert('Rule created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save rule:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save rule';
            setError(errorMessage);
        }
    };

    const startEditing = (rule) => {
        setEditingRule(rule);
        setFormData({
            lang: rule.lang,
            text: rule.text,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            try {
                await api.delete(`/rules/${id}`);
                setRules(rules.filter((rule) => rule.id !== id));
                alert('Rule deleted successfully');
            } catch (error) {
                console.error('Failed to delete rule:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete rule';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Rule Admin</h2>
            {error && <p className="error-message">{error}</p>}
            <Role has="RULE_ADMIN">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Rule'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="rule-form">
                        <h3>{editingRule ? 'Edit Rule' : 'Create Rule'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Language (e.g., EN, ES):</label>
                                <input
                                    type="text"
                                    name="lang"
                                    value={formData.lang}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    placeholder="Enter language code (max 4 characters)"
                                />
                            </div>
                            <div>
                                <label>Text:</label>
                                <textarea
                                    name="text"
                                    value={formData.text}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={1024}
                                    placeholder="Enter rule text (max 1024 characters)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingRule ? 'Update Rule' : 'Create Rule'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Language</th>
                            <th>Text</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rules.length === 0 ? (
                            <tr className={"background-change"}>
                                <td colSpan="5">No rules found.</td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule.id} className={"background-change"}>
                                    <td>{rule.id}</td>
                                    <td>{rule.lang}</td>
                                    <td>{rule.text}</td>
                                    <td>{new Date(rule.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(rule)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(rule.id)}>
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