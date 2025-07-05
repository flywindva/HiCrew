import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import api from '../../api/api';
import { AuthContext } from '../auth-context/auth';
import './callsign-prompt.scss';
import { globalVariables } from '../../config';

const CallsignPrompt = ({ onClose }) => {
    const { t } = useTranslation();
    const { pilot, login } = useContext(AuthContext);
    const [callsign, setCallsign] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allowSelection, setAllowSelection] = useState(true);
    const [assignedCallsign, setAssignedCallsign] = useState('');
    const [availableCallsigns, setAvailableCallsigns] = useState([]);

    useEffect(() => {
        const fetchCallsignStatus = async () => {
            try {
                const response = await api.get('/auth/next-callsign');
                setAllowSelection(response.data.allowSelection);
                if (response.data.allowSelection) {
                    const callsigns = response.data.availableCallsigns.map((cs) =>
                        cs.replace(globalVariables.OACI, '')
                    );
                    setAvailableCallsigns(callsigns);
                    console.log('Available callsigns:', callsigns);
                } else {
                    setAssignedCallsign(response.data.nextCallsign);
                    console.log('Assigned callsign:', response.data.nextCallsign);
                }
            } catch (err) {
                setError(t('fetch_callsign_error'));
                console.error('Error fetching callsign status:', err);
            }
        };
        fetchCallsignStatus();
    }, [t]);

    const handleSelectChange = (selectedOption) => {
        const newCallsign = selectedOption ? selectedOption.value : '';
        setCallsign(newCallsign);
        setError('');
        console.log('Selected callsign:', newCallsign);
    };

    const handleInputChange = (inputValue, { action }) => {
        if (action === 'input-change') {
            const value = inputValue.replace(/[^0-9]/g, '').slice(0, 3);
            setCallsign(value);
            setError('');
            console.log('Input callsign:', value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);
        console.log('Submitting with callsign:', callsign);

        try {
            if (allowSelection) {
                if (!callsign) {
                    setError(t('callsign_required'));
                    setIsSubmitting(false);
                    console.log('Validation failed: callsign is empty');
                    return;
                }

                const callsignNumberRegex = /^[0-9]{3}$/;
                if (!callsignNumberRegex.test(callsign)) {
                    setError(t('callsign_invalid'));
                    setIsSubmitting(false);
                    console.log('Validation failed: invalid callsign format:', callsign);
                    return;
                }

                if (!availableCallsigns.includes(callsign)) {
                    setError(t('callsign_not_available'));
                    setIsSubmitting(false);
                    console.log('Validation failed: callsign not available:', callsign);
                    return;
                }

                const response = await api.post('/auth/update-callsign', { callsign });
                console.log('Update callsign response:', response.data);
                login(
                    { ...pilot, callsign: response.data.pilot.callsign },
                    localStorage.getItem('token')
                );
            } else {
                const response = await api.post('/auth/update-callsign', {});
                console.log('Confirm callsign response:', response.data);
                login(
                    { ...pilot, callsign: response.data.pilot.callsign },
                    localStorage.getItem('token')
                );
            }

            setError('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || t('update_callsign_error'));
            console.error('Error submitting callsign:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const callsignOptions = availableCallsigns.map((cs) => ({
        value: cs,
        label: `${globalVariables.OACI}${cs}`,
    }));

    return (
        <div className="callsign-prompt-overlay">
            <div className="callsign-prompt">
                <h2>{allowSelection ? t('select_callsign') : t('confirm_callsign')}</h2>
                {allowSelection ? (
                    <>
                        <p>{t('choose_or_enter_callsign', { oaci: globalVariables.OACI })}</p>
                        <form onSubmit={handleSubmit}>
                            <Select
                                options={callsignOptions}
                                value={
                                    callsign
                                        ? { value: callsign, label: `${globalVariables.OACI}${callsign}` }
                                        : null
                                }
                                onChange={handleSelectChange}
                                onInputChange={handleInputChange}
                                placeholder={t('select_callsign')}
                                isClearable
                                className="callsign-select"
                                classNamePrefix="react-select"
                                formatOptionLabel={({ label }) => label}
                            />
                            {error && <p className="error">{error}</p>}
                            <button type="submit" className="btn" disabled={isSubmitting}>
                                {isSubmitting ? t('saving') : t('save_callsign')}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: t('confirm_assigned_callsign', { callsign: assignedCallsign }),
                            }}
                        />
                        <form onSubmit={handleSubmit}>
                            {error && <p className="error">{error}</p>}
                            <button type="submit" className="btn" disabled={isSubmitting}>
                                {isSubmitting ? t('confirming') : t('confirm_callsign')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CallsignPrompt;