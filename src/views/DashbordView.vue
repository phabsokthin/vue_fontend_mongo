<template>
    <div>
        <h1>Welcome to the Dashboard!</h1>
        <p>Your email: {{ email || 'Loading...' }}</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const router = useRouter();
        const email = ref('');

        onMounted(() => {
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
                email.value = storedEmail;
            } else {
                console.warn("Email not found in localStorage.");
            }
        });

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            router.push('/'); 
        };

        return { email, logout };
    },
};
</script>
