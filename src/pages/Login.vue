<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');

const login = () => {
  const users = [
    { username: 'user', password: 'user', role: 'user' },
    { username: 'admin', password: 'admin', role: 'admin' },
  ]

  const user = users.find(u => u.username === username.value && u.password === password.value);

  if (user) {
    localStorage.setItem('userRole', user.role);

    // Переход на соответствующую страницу (user или cabinet)
    router.push('/cabinet');
  } else {
    // Неправильные учетные данные - вывод ошибки
    error.value = 'Неправильный логин или пароль!'
  }
};

const router = useRouter();
</script>

<template>
  <div class="container">
    <form>
    <div class="mb-3">
      <label for="login" class="form-label">Логин</label>
      <input type="text" v-model="username" class="form-control" id="login" aria-describedby="emailHelp">
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Пароль</label>
      <input type="password" v-model="password" class="form-control" id="password">
    </div>
    <button @click.prevent="login" type="submit" class="btn btn-primary">Ввойти</button>
  </form>
  {{ error }}
  </div>
</template>

