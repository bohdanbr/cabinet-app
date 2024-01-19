<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { vMaska } from "maska"
import draggable from "vuedraggable";

const router = useRouter()

const userRole = ref(localStorage.getItem('userRole') || '')
const users = ref([])
const loading = ref(true)

const setUserRole = (role) => {
  localStorage.setItem('userRole', role)
  userRole.value = role
}

const roleAdmin = () => setUserRole('admin')
const roleUser = () => setUserRole('user')

const modal = ref(null)
const editUser = ref(null)


onMounted(async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    users.value = await response.json()
    modal.value = new bootstrap.Modal(document.getElementById('modalWindow'))
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
})

const add = () => {
  console.log('Добавление...')
}

const edit = (id) => {
  const user = users.value.find(user => user.id === id)
  editUser.value = JSON.parse(JSON.stringify(user))
  modal.value.show()
}

const saveChanges = () => {
  // Обработка сохранения изменений
  const index = users.value.findIndex(user => user.id === editUser.value.id)

  // Обновление данных пользователя по найденному индексу
  if (index !== -1) {
    // Используйте метод splice для замены старых данных пользователя на обновленные
    users.value.splice(index, 1, { ...editUser.value })

    // Закройте модальное окно
    modal.value.hide()
  }
}

const deleteItem = async (id) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    users.value = users.value.filter(user => user.id !== id)
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
}

const exitSession = () => {
  localStorage.removeItem('userRole')
  router.push('/')
}

const isEditUserValid = computed(() => {
  return editUser.value && editUser.value.name && editUser.value.email && editUser.value.address.zipcode
})


const handleDragChange = (event) => {
  if (event.moved && Array.isArray(event.moved)) {
    event.moved.forEach((movedItem, newIndex) => {
      const originalIndex = users.value.findIndex(user => user.id === movedItem.element.id);
      users.value[originalIndex].order = originalIndex + 1;
    });
  }
};
</script>


<template>
  <div>
    <h1>Cabinet</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Zip Code</th>
          <th scope="col" v-if="userRole === 'admin'">Action</th>
        </tr>
      </thead>
      <draggable v-model="users" tag="tbody" item-key="id" @change="handleDragChange">
        <template #item="{ element: user, index }">
          <tr class="draggable-item">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.address ? user.address.zipcode : '' }}</td>
            <td v-if="userRole === 'admin'">
              <div class="i-class">
                <i class="bi bi-pen-fill" @click="edit(user.id)"></i>
                <i class="bi bi-trash-fill" @click="deleteItem(user.id)"></i>
              </div>
            </td>
          </tr>
        </template>
      </draggable>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalWindow" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Редактирование пользователя</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form v-if="editUser">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" v-model="editUser.name" class="form-control" id="name">
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="editUser.email" class="form-control" id="email">
              </div>
              <div class="mb-3">
                <label for="zipcode" class="form-label">Zip Code</label>
                <input v-model="editUser.address.zipcode" v-maska data-maska="#####-####" class="form-control"
                  id="zipcode">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveChanges" :disabled="!isEditUserValid">Save
              changes</button>
          </div>
        </div>
      </div>
    </div>


    <!--  -->
    <button @click="exitSession">Выйти на главную</button>
    <button @click="roleAdmin" disabled>Роль админа</button>
    <button @click="roleUser" disabled>Роль юзера</button>
  </div>
</template>

<style>
.i-class {
  font-size: 20px;
  cursor: pointer;
}
</style>