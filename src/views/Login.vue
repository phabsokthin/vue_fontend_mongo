<template>
    <div>
        <form @submit.prevent="handleLogin" class="space-x-2">
            <input v-model="email" placeholder="Email" class="p-2 border-2 " required />
            <input v-model="password" type="password" class="p-2 border-2" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
    setup() {
        const email = ref('');
        const password = ref('');
        const errorMessage = ref(null);
        const router = useRouter();

        const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/login', {
            email: email.value,
            password: password.value,
        });

        console.log("Login Response:", response.data); 

        if (response && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email); // Store the email
            console.log("Stored Email:", response.data.email); // Log the stored email
            router.push('/dashboard');
        } else {
            throw new Error("Invalid response from the server");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
        } else {
            errorMessage.value = "An error occurred. Please try again.";
        }
        console.error("Login error:", error);
    }
};



        return { email, password, errorMessage, handleLogin };
    }
};
</script>

<style>
.error {
    color: red;
}
</style>
