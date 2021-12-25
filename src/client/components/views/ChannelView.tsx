import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

export const ChannelView: React.FC = () => {
	const { channelId } = useParams();
	const socket = useSocket();

	const bottomDiv = useRef<HTMLDivElement>(null);

	const [messages, setMessages] = useState<[sender: string, message: string][]>([]);
	const [draftMessage, setDraftMessage] = useState('');

	useEffect(() => {
		setMessages([]);
		socket.emit('joinChannel', channelId);
		socket.on('sendMessage', (sender, _channelId, message) => {
			if (_channelId !== channelId) return;
			setMessages((_messages) => [..._messages, [sender, message]]);
			bottomDiv.current?.scrollIntoView({ behavior: 'smooth' });
		});
		return () => {
			socket.off('sendMessage');
		};
	}, [channelId]);

	const sendMessage = () => {
		if (draftMessage.length === 0) return;
		socket.emit('sendMessage', draftMessage, channelId);
		setDraftMessage('');
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='py-4 flex-1 overflow-y-auto'>
				<h2 className='px-4 text-2xl mt-4 mb-2'>#{channelId}</h2>
				{messages.map(([sender, message]) => (
					<div className='px-4 py-2 hover:bg-gray-50'>
						<h4 className='font-semibold break-words'>{sender}</h4>
						<p className='w-full break-words'>{message}</p>
					</div>
				))}
				<div ref={bottomDiv} />
			</div>
			<div className='p-4 bg-gray-50 flex gap-1 items-center'>
				<input
					type='text'
					className='block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
					value={draftMessage}
					onChange={(e) => setDraftMessage(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') sendMessage();
					}}
				/>
				<button
					className='rounded-md bg-indigo-400 text-white shadow-sm w-10 h-10 flex justify-center items-center outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
					onClick={sendMessage}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 rotate-90'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
