<template>
    <div class="w-2/3 mx-auto">
      <div>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <div class="space-y-2">
              <label for="studentName">Student Name: </label>
              <input id="studentName" type="text" v-model="studentName" class="p-2 border-2 w-96"
                placeholder="Student Name" required />
            </div>
  
            <div class="space-y-2">
              <label for="details">Details: </label>
              <input id="details" type="text" v-model="details" class="p-2 border-2 w-96" placeholder="Detail" required />
            </div>
  
            <div class="space-y-2">
              <label for="course">Course: </label>
              <select id="course" v-model="courseId" class="p-2 border-2 w-96" required>
                <option value="">Select</option>
                <option v-for="c in course" :key="c._id" :value="c._id">
                  {{ c.courseName }}
                </option>
              </select>
            </div>
          </div>
          <button type="submit" class="p-2 mt-4 text-white bg-blue-500">Submit</button>
        </form>
      </div>
  
      <table class="mt-5 table-auto">
        <thead>
          <tr>
            <th>StudentName</th>
            <th>Details</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  
          <template v-for="(c, i) in course" :key="c._id">
            <tr v-for="s in c.student" :key="s._id" class="space-x-5">
              <td>{{ i + 1 }}</td>
              <td>{{ s.studentName }}</td>
              <td>{{ s.detail }}</td>
              <td>{{ c.courseName }}</td>
              <td class="space-x-2">
                <button
                  class="bg-red-500 p-1.5 text-xs text-white hover:bg-red-600 transition-all duration-300 rounded-full"
                  @click="handleDelete(c._id, s._id)">Delete</button>
                <RouterLink :to="{ name: 'update', params: { courseId: c._id, studentId: s._id } }"
                  class="bg-blue-500 p-1.5 text-xs rounded-full hover:bg-blue-600 transition-all ease-in-out text-white">
                  Edit
                </RouterLink>
              </td>
            </tr>
          </template>
  
        </tbody>
      </table>
  
    </div>
  
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { RouterLink } from 'vue-router';
  
  export default {
    setup() {
      const course = ref([]);
      const courseId = ref("");
      const studentName = ref("");
      const details = ref("");
      const useCourseId = ref("")
  
      const fetchCourse = async () => {
        try {
          const response = await fetch('https://node-mongo-api-ywzx.onrender.com/api/fetchCourse');
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          course.value = data;
        } catch (error) {
          console.error("Failed to fetch course:", error);
        }
      };
  
      const handleSubmit = async () => {
        try {
          const response = await fetch(`https://node-mongo-api-ywzx.onrender.com/api/courses/${useCourseId.value}/students`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              studentName: studentName.value,
              detail: details.value,
            }),
          });
          clearData()
          const data = await response.json();
          console.log(data.message);
          alert(data.message);
          fetchCourse();
        } catch (error) {
          console.error("Failed to submit form:", error);
          alert("An error occurred while adding the student.");
        }
      };
  
      onMounted(fetchCourse);
  
      watch(courseId, (c) => {
        useCourseId.value = c
      });
  
  
      const handleDelete = async (courseId, studentId) => {
        if (window.confirm("Are you sure delete?")) {
          try {
            const response = await fetch(`https://node-mongo-api-ywzx.onrender.com/api/courses/${courseId}/students/${studentId}`, {
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
              },
            })
  
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error deleting student:", errorData.message);
              alert(errorData.message);
  
              return;
            }
  
            const data = await response.json();
            console.log(data.message);
            fetchCourse();
            alert(data.message);
          }
          catch (err) {
            console.log(err)
          }
        }
      }
  
      function clearData() {
        useCourseId.value = ""
        studentName.value = ""
        details.value = ""
      }
  
      return { course, courseId, studentName, details, handleSubmit, useCourseId, handleDelete };
    }
  };
  </script>
  