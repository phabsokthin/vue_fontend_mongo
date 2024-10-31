<template>
     <div class="w-2/3 mx-auto">
        <div>
            <form @submit.prevent="updateRoom">
                <div class="space-y-2">
                    <div class="space-y-2">
                        <label for="roomName">Room: </label>
                        <input id="roomName" type="text" v-model="roomName" class="p-2 border-2 w-96"
                            placeholder="Room Name" required />
                    </div>

                    <div class="space-y-2">
                        <label for="details">Details: </label>
                        <input id="details" type="text" v-model="details" class="p-2 border-2 w-96"
                            placeholder="Details" required />
                    </div>
                    
                </div>
                <button type="submit" class="p-2 mt-4 text-white bg-blue-500">Update</button>
            </form>
        </div>
        <RouterLink :to="{name: 'room'}">Back</RouterLink>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default{
    setup(){

        const roomName = ref("")
        const details = ref("")
        const route = useRoute();

        const fetchRoomId = async() => {

            const response = await fetch(`http://localhost:8080/api/courses/${route.params.courseId}/students/${route.params.studentId}/rooms/${route.params.roomId}`)

            if(!response.ok){
                throw new Error('failed fetch room by id')
            }

            const data = await response.json();

            roomName.value = data.roomName
            details.value = data.detail

            console.log('your id is', data)
        }

        onMounted(() => {
            fetchRoomId();
        })

        const updateRoom = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/courses/${route.params.courseId}/students/${route.params.studentId}/rooms/${route.params.roomId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            roomName: roomName.value,
                            detail: details.value
                        }),
                    }
                );

                if (!response.ok) throw new Error("Failed to update room.");
                const data = await response.json();
                alert(data.message);
                console.log(data)
            } catch (error) {
                console.error(error);
                alert("An error occurred while updating the room.");
            }
        };

        return {roomName, details,updateRoom}
    }
}

</script>