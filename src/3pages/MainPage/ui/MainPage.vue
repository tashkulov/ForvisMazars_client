<template>
  <div class="main-page">
    <header class="header">
      <h1>Welcome to the Main Page</h1>
      <router-link to="/schedule">
        <button class="navigate-button">Go to Schedule</button>
      </router-link>
    </header>
    <div class="content">
      <p>This is the main page. Navigate to the schedule page using the button above.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  background-color: #007bff;
  color: white;
  padding: 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.navigate-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #0056b3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigate-button:hover {
  background-color: #003d80;
}

.content {
  text-align: center;
}
</style>
