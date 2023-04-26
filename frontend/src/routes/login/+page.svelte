<script>
// @ts-nocheck
    import axios from 'axios';
    import { AUTH_API } from '../../utils/api'
    let name = '';
    let password = '';

    // @ts-ignore
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(name, password)
        try {
            const response = await axios.post(`${AUTH_API}/auth/login`, { name, password });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
</script>

<div class="container">
    <div class="form-wrapper">
        <form on:submit={handleSubmit}>
            <h2>Sign In</h2>
            <div>
                <input type="text" placeholder="username" bind:value={name} />
            </div>
            <div>
                <input type="password" placeholder="password" bind:value={password} />
            </div>
            <button type="submit">Log in</button>
        </form>
    </div>
</div>

<style>
input {
  width: 300px;
  height: 40px;
  font-size: 18px;
  border-radius: 5px;
  padding-left: 10px ;
}

h2 {
    text-align: center;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
}

.form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    padding: 15px;
    min-width: 200px;
    border-radius: 10px;
}

button {
    margin-top: 10px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
</style>