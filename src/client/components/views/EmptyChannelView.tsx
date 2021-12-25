import React from 'react';

export const EmptyChannelView: React.FC = () => {
	return (
		<div className='flex justify-center items-center h-full'>
			<p className='text-sm text-gray-500'>Select a channel to start chatting</p>
		</div>
	);
};
