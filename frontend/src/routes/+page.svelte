<script>
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
</script>
<div class="container">
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