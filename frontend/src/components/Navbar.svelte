<script>
// @ts-nocheck
    import Button, { Label } from '@smui/button'
    import { goto } from '$app/navigation';
    const handleSignInClick = () => {
        goto('/login')
    }
</script>


<nav>
    <div class="container">
        <div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <h3 on:click={() => goto('/')}>Microsocial</h3>
        </div>
        <div>
            <button on:click={handleSignInClick}>Sign in</button>
        </div>
    </div>
</nav>


<style>
    nav {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }
    
    .container {
        display: flex;
        margin: 0 auto;
        max-width: 2000px;
        padding: 0 16px;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
    }

    h3 {
        cursor: pointer;
    }

    h3:hover {
        color: gray;
    }

    button {
        background-color: #2a47e7;
        border: none; 
        color: white;
        border-radius: 10px; 
        padding: 10px 20px; 
        text-align: center; 
        text-decoration: none; 
        display: inline-block; 
        font-size: 16px; 
        margin: 4px 2px; 
        cursor: pointer;   
    }

    button:hover {
        background-color: #4e65eb;
    }

</style>