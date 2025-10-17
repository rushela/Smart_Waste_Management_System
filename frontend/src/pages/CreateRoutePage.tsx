import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RouteForm from '../components/RouteForm';

const API_URL = 'http://localhost:5001/api/routes';

/**
 * Page for creating a new draft route.
 */
const CreateRoutePage: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Handles the form submission by sending a POST request to the backend.
     * @param name - The name of the route from the form.
     */
    const handleCreate = async (name: string) => {
        try {
            await axios.post(API_URL, { name });
            // Redirect to the dashboard on successful creation
            navigate('/');
        } catch (error) {
            console.error('Failed to create route:', error);
            alert('Error: Could not create the route.');
        }
    };

    return (
        <RouteForm 
            onSubmit={handleCreate} 
            buttonText="Create Draft Route"
            pageTitle="Create New Route"
        />
    );
};

export default CreateRoutePage;