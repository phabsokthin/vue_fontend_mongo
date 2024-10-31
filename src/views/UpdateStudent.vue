<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-2">
            <div class="space-y-2">
                <label for="studentName">Student Name: </label>
                <input 
                    id="studentName" 
                    type="text" 
                    v-model="studentName" 
                    class="p-2 border-2 w-96" 
                    placeholder="Student Name" 
                    required 
                />
            </div>

            <div class="space-y-2">
                <label for="details">Details: </label>
                <input 
                    id="details" 
                    type="text" 
                    v-model="details" 
                    class="p-2 border-2 w-96" 
                    placeholder="Detail" 
                    required 
                />
            </div>

        </div>
        <button type="submit" class="p-2 mt-4 text-white bg-blue-500">Submit</button>

        <!-- Display loading or error messages -->
        <div v-if="loading" class="mt-4">Loading...</div>
        <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
        <div v-if="successMessage" class="mt-4 text-green-500">{{ successMessage }}</div>
    </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const studentName = ref('');
        const details = ref('');
        const loading = ref(false);
        const error = ref(null);
        const successMessage = ref(null);

        const route = useRoute();
        const router = useRouter();

        const fetchStudentDetails = async () => {
            loading.value = true;
            error.value = null;

            try {
                const response = await fetch(`https://node-mongo-api-ywzx.onrender.com/api/courses/${route.params.courseId}/students/${route.params.studentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student details');
                }
                const data = await response.json();
                
                studentName.value = data.student.studentName;
                details.value = data.student.detail;
            } catch (err) {
                error.value = err.message || 'An error occurred while fetching student details.';
            } finally {
                loading.value = false;
            }
        };

        const handleSubmit = async () => {
            loading.value = true; 
            error.value = null; 
            successMessage.value = null; 

            const formData = {
                studentName: studentName.value,
                detail: details.value, 
            };

            try {
                const response = await fetch(`https://node-mongo-api-ywzx.onrender.com/api/courses/${route.params.courseId}/students/${route.params.studentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), // Send the correct body format
                });

                if (!response.ok) {
                    throw new Error('Failed to update student details');
                }

                const data = await response.json();
                successMessage.value = data.message; 
                router.push("/")
                clearData(); 
            } catch (err) {
                error.value = err.message || 'An error occurred while updating the student.';
            } finally {
                loading.value = false; 
            }
        };

        const clearData = () => {
            studentName.value = '';
            details.value = '';
        };

        onMounted(fetchStudentDetails);

        return {
            studentName,
            details,
            loading,
            error,
            successMessage,
            handleSubmit,
        };
    },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
