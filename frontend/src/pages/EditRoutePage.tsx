import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import RouteForm from '../components/RouteForm';

/**
 * Page for editing the name of an existing route.
 */
const EditRoutePage: React.FC = () => {
    // Get the route 'id' from the URL parameters
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialName, setInitialName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const API_URL = `http://localhost:5001/api/routes/${id}`;

    // Fetch the current route data to populate the form
    const fetchRoute = useCallback(async () => {
        try {
            const { data } = await axios.get(API_URL);
            setInitialName(data.name);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch route data:', error);
            alert('Could not find route data.');
            navigate('/');
        }
    }, [id, API_URL, navigate]);
    
    useEffect(() => {
        fetchRoute();
    }, [fetchRoute]);

    /**
     * Handles the form submission by sending a PUT request to update the route.
     * @param name - The new name for the route.
     */
    const handleUpdate = async (name: string) => {
        try {
            // We only send the 'name' because this form is just for editing the name.
            // The status is not changed here.
            await axios.put(API_URL, { name });
            navigate('/');
        } catch (error) {
            console.error('Failed to update route:', error);
            alert('Error: Could not update the route.');
        }
    };

    if (loading) {
        return <p>Loading route details...</p>;
    }

    return (
        <RouteForm
            onSubmit={handleUpdate}
            initialName={initialName}
            buttonText="Update Route Name"
            pageTitle="Edit Route"
        />
    );
};

export default EditRoutePage; 