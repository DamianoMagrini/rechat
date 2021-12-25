import faker from 'faker';
import * as Joi from 'joi';
import { Server } from 'socket.io';

const io = new Server(3001, {
	cors: {},
});

io.on('connection', (socket) => {
	let username = faker.name.firstName();

	socket.emit('setUsername', username);

	socket.on('setUsername', (_username: string) => {
		if (Joi.string().min(3).validate(_username).error) return;
		username = _username;
		socket.emit('setUsername', _username);
	});

	socket.on('createChannel', (channelId: string) => {
		if (
			Joi.string()
				.regex(/^[a-z1-9\-]+$/)
				.validate(channelId).error
		)
			return;
		io.emit('createChannel', channelId);
	});

	socket.on('joinChannel', (channelId: string) => {
		if (
			Joi.string()
				.regex(/^[a-zA-Z1-9\-]+$/)
				.validate(channelId).error
		) {
			return;
		}
		socket.join(channelId);
	});

	socket.on('sendMessage', (message: string, channelId: string) => {
		if (Joi.string().min(1).validate(message).error) return;
		if (Joi.string().validate(channelId).error) return;
		io.to(channelId).emit('sendMessage', username, channelId, message);
	});
});
