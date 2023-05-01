<script>
	// @ts-nocheck
	import moment from 'moment';
	import Icon from '@iconify/svelte';
	import trashBold from '@iconify/icons-ph/trash-bold';
	import commentRounded from '@iconify/icons-material-symbols/comment-rounded';
	import likeOutline from '@iconify/icons-mdi/like-outline';
	import likeIcon from '@iconify/icons-mdi/like';
	import { user } from '../store';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { CONTENT_API } from '../utils/api';

	export let post;
	console.log(post);
	const handleDelete = async (post_id) => {
		// delete
		try {
			let res = await axios.delete(`${CONTENT_API}/posts/${post_id}`);
			post.set(null);
			goto('/');
		} catch (error) {
			console.log(error);
		}
	};

	const handleLike = async (post_id) => {
		try {
			const res = await axios.post(`${CONTENT_API}/likes/post`, {
				post_id: post_id,
				username: $user.name
			});
			const { message } = res.data;
			if (message === 'liked') {
				const newLikes = [...post.likes, $user.name];
				post = { ...post, likes: newLikes };
			} else if (message === 'unliked') {
				const newLikes = post.likes.filter((username) => username !== $user.name);
				post = { ...post, likes: newLikes };
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div style="display: flex; justify-content: space-between">
	<div style="display: flex; gap: 15px;">
		<p><b>{post.username}</b></p>
		<p class="date">{moment(post.date).fromNow()}</p>
	</div>
	{#if post.username === $user.name}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => handleDelete(post.id)}>
			<Icon icon={trashBold} color="red" style="margin-top: 10px; cursor: pointer;" />
		</div>
	{/if}
</div>
<h3><b>{post.title}</b></h3>
<p>{post.description}</p>

<img src={post.image} alt="" />
<div style="display: flex; gap: 20px">
	<div style="display: flex; gap: 10px">
		<p class="likes-comments">{post.likes?.length || 0}</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		{#if !post.likes.includes($user.name)}
			<div on:click={() => handleLike(post.id)}>
				<Icon
					icon={likeOutline}
					color="#007bff"
					style="cursor: pointer; margin-top: 12px"
					height="20"
				/>
			</div>
		{:else}
			<div on:click={() => handleLike(post.id)}>
				<Icon
					icon={likeIcon}
					color="#007bff"
					style="cursor: pointer; margin-top: 12px"
					height="20"
				/>
			</div>
		{/if}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div style="display: flex; gap: 10px">
		<p class="likes-comments">{post.comments?.length || 0}</p>
		<Icon icon={commentRounded} color="#007bff" style="margin-top: 14px" height="20" />
	</div>
</div>

<style>
	.likes-comments {
		font-family: 'Open Sans', sans-serif;
		color: gray;
	}

	img {
		height: auto;
		width: 100%;
		object-fit: contain;
	}

	.date {
		color: gray;
		font-size: small;
		margin-top: 17px;
	}
</style>
