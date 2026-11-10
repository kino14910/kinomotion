import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('note')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		trailingSlash: true,
		customData: '<language>zh-CN</language>',
		items: posts.map((post) => ({
			...post.data,
			link: `/note/${post.id}/`,
			categories: post.data.tags,
		})),
	});
}
