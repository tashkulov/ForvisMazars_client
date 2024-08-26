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
/* General Styles */
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

/* Main Page */
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #74ebd5, #acb6e5);
}

/* Header */
.header {
  background: rgba(0, 123, 255, 0.8);
  color: white;
  padding: 40px;
  width: 100%;
  text-align: center;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Navigation Button */
.navigate-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  color: white;
  background-color: #0056b3;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.navigate-button:hover {
  background-color: #003d80;
  transform: scale(1.05);
}

.navigate-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

/* Content */
.content {
  text-align: center;
  margin-top: 20px;
  max-width: 800px;
}

.content p {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
  padding: 0 20px;
  font-weight: 300;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2.5rem;
  }

  .navigate-button {
    padding: 12px 24px;
    font-size: 1rem;
  }

  .content p {
    font-size: 1rem;
  }
}

@media (min-width: 1200px) {
  .header h1 {
    font-size: 3.5rem;
  }

  .navigate-button {
    padding: 20px 40px;
    font-size: 1.5rem;
  }
}
</style>
