<script>
<<<<<<< HEAD
// @ts-nocheck
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { CONTENT_API } from '../utils/api'

    let data = []

    onMount(async () => {
        try {
            const response = await axios.get(`${CONTENT_API}/posts`);
            data = response.data.result
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    });
=======
	// @ts-nocheck
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { CONTENT_API, fetchPosts } from '../utils/api';
	import { user } from '../store';
	import { data } from '../store';
	import Post from '../components/Post.svelte';

	// Post
	let title = '';
	let tags = '';
	let image = null;
	let description = '';
	let imgBase64 = '';

	// Page
	let pageNumber = 1;
	let noOfpages = 1;
	onMount(async () => {
		try {
			const res = await fetchPosts(pageNumber);
			const postsData = res.data;
			noOfpages = res.noOfPages;
			data.set(postsData);
			console.log($data);
		} catch (error) {
			console.error(error);
		}
	});

	const handleFileChange = (event) => {
		console.log(event.target.files[0]);
		image = event.target.files[0];
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (title && description && tags) {
			if (image) {
				const reader = new FileReader();
				reader.readAsDataURL(image);
				reader.onload = async () => {
					imgBase64 = reader.result;
					console.log(title, tags, imgBase64, description);
					let res = await axios.post(`${CONTENT_API}/posts`, {
						username: $user.name,
						title: title,
						tags: tags,
						image: imgBase64,
						description: description
					});
					const newPost = { ...res.data.data, comments: [], likes: [] };
					data.update((prev) => [newPost, ...prev]);
				};
			} else {
				let res = await axios.post(`${CONTENT_API}/posts`, {
					username: $user.name,
					title: title,
					tags: tags,
					image: imgBase64,
					description: description
				});
				const newPost = { ...res.data.data, comments: [], likes: [] };
				data.update((prev) => [newPost, ...prev]);
			}
			title = '';
			tags = '';
			image = null;
			description = '';
			imgBase64 = '';
		}
	};

	const handleShowMore = async () => {
		pageNumber++;
		console.log(pageNumber);
		const res = await fetchPosts(pageNumber);
		const newPosts = res.data;
		data.update((prev) => [...prev, ...newPosts]);
	};
>>>>>>> main
</script>

<div class="container">
<<<<<<< HEAD
    <div class="grid-container">
        {#each data as post, i}
            <div class="post-container">
                <p>ID: {post.id}</p>
                <p>{post.username}</p>
                <p>{post.date}</p>
                <p>{post.description}</p>
                <!-- <img src={post.image} alt=""/> -->
                <p>{post.tags}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        margin: 0 auto;
        max-width: 1000px;
        /* margin-top: 30px; */
        padding: 15px;
    }

    .post-container {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
        padding: 15px;  
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 16px;
        justify-content: center;
    }

    
</style>
=======
	<div class="grid-container">
		{#if $user}
			<div class="post-container">
				<h3 style="text-align: center;">Post a post</h3>
				<form on:submit={handleSubmit}>
					<input type="text" placeholder="Title" class="title-input" bind:value={title} />
					<textarea type="text" placeholder="What's on your mind?" bind:value={description} />
					<input
						type="text"
						placeholder="Space between tags"
						class="tags-input"
						bind:value={tags}
					/>
					<div class="submit-container">
						<input
							type="file"
							id="fileinput"
							class="file-input"
							accept=".jpg, .jpeg, .heic, .heif, .png"
							on:change={handleFileChange}
						/>
						<label for="fileinput">
							<p class="custom-file">Image</p>
						</label>
						{#if title && description && tags}
							<button class="submit-button" type="submit">Post</button>
						{/if}
					</div>
				</form>
			</div>
		{/if}
		{#each $data as post, i}
			<Post {post} {i} />
		{/each}
	</div>
	{#if pageNumber < noOfpages}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div style="text-align:center;" on:click={handleShowMore}>
			<p class="show-more">Show more</p>
		</div>
	{/if}
</div>

<style>
	.show-more {
		color: #007bff;
		cursor: pointer;
	}

	.container {
		margin: 0 auto;
		max-width: 900px;
		padding: 15px;
	}

	.post-container {
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
		padding: 15px;
		border-radius: 10px;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 16px;
		justify-content: center;
	}

	.title-input {
		width: auto;
		padding: 10px;
		font-size: 18px;
		border-radius: 5px;
		border-width: thin;
		border-color: gray;
	}

	textarea {
		font-family: 'Open Sans', sans-serif;
		resize: none;
		margin-top: 15px;
		width: auto;
		padding: 10px;
		font-size: 18px;
		border-radius: 5px;
		border-width: thin;
		border-color: gray;
	}

	.file-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	.tags-input {
		width: auto;
		padding: 10px;
		font-size: 18px;
		border-radius: 5px;
		border-width: thin;
		border-color: gray;
		margin-top: 15px;
	}

	.custom-file {
		margin-top: 15px;
		background-color: #007bff;
		color: #fff;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.custom-file:hover {
		background-color: #0062cc;
	}

	.submit-container {
		display: flex;
		justify-content: space-between;
	}

	.submit-button {
		margin-top: 15px;
		background-color: #3908e9;
		color: #ffffff;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		height: 40px;
	}

	.submit-button:hover {
		background-color: #500af3;
	}
</style>
>>>>>>> main
