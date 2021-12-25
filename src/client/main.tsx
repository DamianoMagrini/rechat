import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { socket, SocketContext } from './context/SocketContext';
import './global.scss';

render(
	<React.StrictMode>
		<SocketContext.Provider value={socket}>
			<App />
		</SocketContext.Provider>
	</React.StrictMode>,
	document.getElementById('app-root'),
);
