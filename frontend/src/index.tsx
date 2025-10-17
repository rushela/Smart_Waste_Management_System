import './index.css';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(
		<AuthProvider>
			<AppRouter />
		</AuthProvider>
	);
}