import React from 'react';
import { Link, useMatch } from 'react-router-dom';

export interface ChannelLinkViewProps {
	channelId: string;
}

export const ChannelLinkView: React.FC<ChannelLinkViewProps> = ({ channelId }) => {
	const match = useMatch(`/${channelId}`);
	return (
		<Link
			to={`/${channelId}`}
			className={`block px-4 py-2 break-words rounded-r-md ${
				match ? 'bg-indigo-400 text-white' : 'text-indigo-400 hover:bg-indigo-50'
			}`}>
			#{channelId}
		</Link>
	);
};
