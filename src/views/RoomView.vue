<template>
    <div class="w-2/3 mx-auto">
        <div>
            <form @submit.prevent="handleSubmit">
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

                    <div class="space-y-2">
                        <label for="course">Course: </label>
                        <select id="course" v-model="courseId" class="p-2 border-2 w-96" required>
                            <option value="" selected>Select</option>
                            <option v-for="c in course" :key="c._id" :value="c._id">
                                {{ c.courseName }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2" v-if="filteredStudents.length > 0">
                        <label for="student">Student: </label>
                        <select id="student" v-model="studentId" class="p-2 border-2 w-96" required>
                            <option value="">Select</option>
                            <option v-for="stu in filteredStudents" :key="stu._id" :value="stu._id">
                                {{ stu.studentName }}
                            </option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="p-2 mt-4 text-white bg-blue-500">Submit</button>
            </form>


            <table class="mt-5 table-auto">
                <thead>
                    <tr>
                        <th>RoomName</th>
                        <th>Details</th>
                        <th>Student</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    <template v-for="(c, i) in course" :key="c._id">
                        <template v-for="s in c.student" :key="s._id" class="space-x-5">
                            <tr v-for="r in s.rooms" :key="r._id">
                                <td>{{ i + 1 }}</td>
                                <td>{{ r.roomName }}</td>
                                <td>{{ s.detail }}</td>
                                <td>{{ s.studentName }}</td>
                                <td class="space-x-2">
                                    <button
                                        class="bg-red-500 p-1.5 text-xs text-white hover:bg-red-600 transition-all duration-300 rounded-full"
                                        @click="handleDeleteRoom(c._id, s._id, r._id)">Delete</button>
                                    <RouterLink :to="{ name: 'updateRoom', params: { courseId: c._id, studentId: s._id, roomId: r._id} }"
                                        class="bg-blue-500 p-1.5 text-xs rounded-full hover:bg-blue-600 transition-all ease-in-out text-white">
                                        Edit
                                    </RouterLink>
                                </td>
                            </tr>
                        </template>
                    </template>

                </tbody>
            </table>
        </div>

        <RouterLink to="/">Back</RouterLink>
    </div>
</template>
<script>
import { onMounted, ref, computed } from 'vue';


export default {
    setup() {
        const roomName = ref("");
        const details = ref("");
        const course = ref([]);
        const courseId = ref(null);
        const studentId = ref(null);

        const fetchCourse = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/fetchCourse');
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                course.value = data;
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        };

        const filteredStudents = computed(() => {
            const selectedCourse = course.value.find(c => c._id === courseId.value);
            return selectedCourse ? selectedCourse.student : [];
        });

        onMounted(() => {
            fetchCourse();
        });


        const handleSubmit = async () => {

            try {
                const response = await fetch(`http://localhost:8080/api/courses/${courseId.value}/students/${studentId.value}/rooms`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        roomName: roomName.value,
                        detail: details.value
                    })
                })

                if (!response.ok) {
                    throw new Error('Failed data fect')
                }
                const result = await response.json();
                alert(result.message || "Room added successfully.");
                fetchCourse();
                console.log(result)
            }
            catch (err) {
                console.log(err)
            }
        }


        const handleDeleteRoom = async (courseId, studentId, roomId) => {
            try {
                if (window.confirm('Are you sure delete?')) {
                    const response = await fetch(`http://localhost:8080/api/courses/${courseId}/students/${studentId}/rooms/${roomId}`, {
                        method: "DELETE"
                    })
                    if (!response.ok) {
                        throw new Error('canot delete')
                    }
                    const result = await response.json();
                    fetchCourse();
                    alert(result.message || 'Save successfull')
                }
            }
            catch (err) {
                console.log(err)
            }
        }

        return { course, roomName, details, courseId, studentId, filteredStudents, handleSubmit, handleDeleteRoom };
    }
};
</script>
