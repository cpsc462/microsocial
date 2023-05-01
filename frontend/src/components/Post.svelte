<script>
	// @ts-nocheck
	import moment from 'moment';
	import Icon from '@iconify/svelte';
	import trashBold from '@iconify/icons-ph/trash-bold';
	import commentRounded from '@iconify/icons-material-symbols/comment-rounded';
	import likeOutline from '@iconify/icons-mdi/like-outline';
	import likeIcon from '@iconify/icons-mdi/like';
	import { data } from '../store';
	import { user } from '../store';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { CONTENT_API } from '../utils/api';

	export let post;
	export let i;

	const handleDelete = async (post_id) => {
		// delete
		try {
			let res = await axios.delete(`${CONTENT_API}/posts/${post_id}`);
			data.update((prev) => prev.filter((post) => post.id !== post_id));
		} catch (error) {
			console.log(error);
		}
	};

	const handleLike = async (post_id, i, like) => {
		try {
			await axios.post(`${CONTENT_API}/likes/post`, {
				post_id: post_id,
				username: $user.name
			});
			if (like) {
				data.update((prev) => {
					prev[i].likes.push($user.name);
					console.log(prev);
					return [...prev];
				});
			} else {
				data.update((prev) => {
					prev[i].likes = prev[i].likes.filter((username) => username !== $user.name);
					console.log(prev);
					return [...prev];
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const routePostDetails = (post_id) => {
		goto(`/post/${post_id}`);
	};
</script>

<div class="post-container">
	<div style="display: flex; justify-content: space-between">
		<div style="display: flex; gap: 15px;">
			<p><b>{post.username}</b></p>
			<p class="date">{moment(post.date).fromNow()}</p>
		</div>
		{#if post.username == $user.name}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={() => handleDelete(post.id)}>
				<Icon icon={trashBold} color="red" style="margin-top: 10px; cursor: pointer;" />
			</div>
		{/if}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={routePostDetails(post.id)}>
		<h3 style="cursor:pointer"><b>{post.title}</b></h3>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={routePostDetails(post.id)}>
		<p style="cursor:pointer">{post.description}</p>
	</div>
	<img src={post.image} alt="" />
	<div style="display: flex; gap: 20px">
		<div style="display: flex; gap: 10px">
			<p class="likes-comments">{post.likes?.length || 0}</p>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if !post.likes.includes($user.name)}
				<div on:click={() => handleLike(post.id, i, true)}>
					<Icon
						icon={likeOutline}
						color="#007bff"
						style="cursor: pointer; margin-top: 12px"
						height="20"
					/>
				</div>
			{:else}
				<div on:click={() => handleLike(post.id, i, false)}>
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
		<div style="display: flex; gap: 10px" on:click={() => routePostDetails(post.id)}>
			<p class="likes-comments">{post.comments?.length || 0}</p>
			<Icon
				icon={commentRounded}
				color="#007bff"
				style="cursor: pointer; margin-top: 14px"
				height="20"
			/>
		</div>
	</div>
</div>

<style>
	.post-container {
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
		padding: 15px;
		border-radius: 10px;
	}

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
