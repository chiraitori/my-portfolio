import type { Post } from '$lib/types/portfolio';
import hello from '../post/Hello.md?raw';
import loving from '../post/Loving.md?raw';
import cosplaying from '../post/Cosplaying.md?raw';

export const posts: Post[] = [
	{
		title: 'Hello!',
		description: 'Welcome to my new website! Check out my previous portfolio version.',
		readTime: '1 min read',
		tags: ['General', 'Update'],
		date: '2026-06-10',
		content: hello
	},
	{
		title: 'I have a girlfriend after 2 years! 💖',
		description: 'A personal story about how I met my lover, our dating journey, and how happy I am now.',
		readTime: '2 min read',
		tags: ['Personal', 'Story'],
		date: '2026-06-10',
		content: loving
	},
	{
		title: 'Why I decided to start cosplaying my favorite characters 👗',
		description: 'Sharing my journey, thoughts, and costuming updates on entering the world of cosplay.',
		readTime: '3 min read',
		tags: ['Personal', 'Cosplay', 'Anime'],
		date: '2026-06-09',
		content: cosplaying
	}
];


