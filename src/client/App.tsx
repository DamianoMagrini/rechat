import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChannelLinkView } from './components/views/ChannelLinkView';
import { ChannelView } from './components/views/ChannelView';
import { EmptyChannelView } from './components/views/EmptyChannelView';
import { useSocket } from './context/SocketContext';

export const App: React.FC = () => {
	const socket = useSocket();

	const [username, setUsername] = useState('');
	const [localUsername, setLocalUsername] = useState('');
	const [channels, setChannels] = useState<string[]>([]);
	const [channelIdDraft, setChannelIdDraft] = useState('');

	useEffect(() => {
		socket.on('setUsername', (_username: string) => {
			setUsername(_username);
			setLocalUsername(_username);
		});
		socket.on('createChannel', (_channelId: string) => {
			setChannels((_channels) => {
				if (_channels.includes(_channelId)) return _channels;
				return [..._channels, _channelId];
			});
		});
		return () => {
			socket.off('setUsername');
			socket.off('createChannel');
		};
	}, []);

	return (
		<BrowserRouter>
			<div className='flex h-screen'>
				<div className='w-64 border-r flex-shrink-0 border-r-gray-100 h-full'>
					<h1 className='p-2 text-xl font-bold pt-3 bg-gray-50'>Rechat</h1>
					<div className='px-2'>
						<label className='mt-2 block'>
							<p>Change your username</p>
							<input
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
								type='text'
								value={localUsername}
								onChange={(e) => setLocalUsername(e.target.value)}
								onKeyPress={(e) => {
									if (e.key !== 'Enter') return;
									socket.emit('setUsername', localUsername);
								}}
							/>
							{localUsername.length < 3 && (
								<p className='mt-1 text-red-500'>Usernames must be at least 3 characters long</p>
							)}
							<p className='mt-1 text-sm tracking-wide text-gray-500'>Chatting as {username}</p>
						</label>
						<h2 className='mt-4 text-xl'>Channels</h2>
						<input
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
							type='text'
							placeholder='Add channel'
							value={channelIdDraft}
							onChange={(e) => setChannelIdDraft(e.target.value)}
							onKeyPress={(e) => {
								if (e.key !== 'Enter') return;
								if (channels.includes(channelIdDraft)) return;
								socket.emit('createChannel', channelIdDraft);
								setChannelIdDraft('');
							}}
						/>
						{!channelIdDraft.match(/^[a-z1-9\-]*$/) && (
							<p className='mt-1 text-red-500'>
								Channel name may only contain lowercase letters, numbers, and hyphens
							</p>
						)}
					</div>

					<div className='mt-2'>
						{channels.map((channelId) => (
							<ChannelLinkView channelId={channelId} key={`channel-link-#${channelId}`} />
						))}
					</div>
				</div>
				<div className='flex-1 overflow-x-hidden'>
					<Routes>
						<Route path='/' element={<EmptyChannelView />} />
						<Route path=':channelId' element={<ChannelView />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
};
