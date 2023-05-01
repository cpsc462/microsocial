<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fetchOnePost } from '../../../utils/api.js';
	import PostDetails from '../../../components/PostDetails.svelte';

	const id = $page.params.slug;

	let post = null;
	onMount(async () => {
		try {
			const res = await fetchOnePost(id);
			post = res;
		} catch (error) {
			console.error(error);
		}
	});
</script>

{#if post}
	<div class="container">
		<div class="post-container">
			<PostDetails {post} />
		</div>
	</div>
{/if}

<style>
	.post-container {
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
		padding: 15px;
		border-radius: 10px;
	}

	.container {
		margin: 0 auto;
		max-width: 1200px;
		padding: 15px;
	}
</style>
