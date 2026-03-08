<template>
  <div class="flex-1 p-5 md:p-8">
    <Transition enter-from-class="opacity-0 translate-y-2" enter-active-class="transition-all duration-300" leave-to-class="opacity-0 translate-y-2" leave-active-class="transition-all duration-300">
      <div v-if="toast.message" class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 text-white"
        :style="{ backgroundColor: toast.type === 'error' ? 'var(--color-error)' : 'var(--color-success)' }">
        <CheckCircle v-if="toast.type === 'success'" :size="16" />
        <X v-else :size="16" />
        {{ toast.message }}
      </div>
    </Transition>

    <div class="max-w-4xl mx-auto">
      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="border-b border-border">
          <div class="flex gap-1 p-2">
            <button @click="activeTab = 'profile'" :class="activeTab === 'profile' ? 'bg-primary text-white' : 'text-secondary hover:bg-muted'" class="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <User :size="16" class="inline-block mr-2" />Ubah Profil
            </button>
            <button @click="activeTab = 'password'" :class="activeTab === 'password' ? 'bg-primary text-white' : 'text-secondary hover:bg-muted'" class="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <Lock :size="16" class="inline-block mr-2" />Ubah Kata Sandi
            </button>
          </div>
        </div>

        <!-- Profile Tab -->
        <div v-show="activeTab === 'profile'" class="p-6 md:p-8">
          <div class="flex flex-col items-center mb-8">
            <div class="relative">
              <img :src="profilePhoto || 'https://ui-avatars.com/api/?name=' + profile.name" class="size-32 rounded-full object-cover border-4 border-border shadow-lg">
              <label class="absolute bottom-0 right-0 size-10 bg-primary hover:bg-primary-hover rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                <Camera :size="20" class="text-white" />
                <input type="file" @change="handlePhotoChange" accept=".jpg,.jpeg,.png" class="hidden">
              </label>
            </div>
            <p class="text-sm text-secondary mt-4">Klik ikon kamera untuk mengubah foto</p>
            <p v-if="profileErrors.photo" class="text-xs text-error mt-1">{{ profileErrors.photo }}</p>
          </div>

          <form @submit.prevent="saveProfile" class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Nama Lengkap <span class="text-error">*</span></label>
                <input v-model="profile.name" type="text" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm" :class="profileErrors.name ? 'border-error' : 'border-border'">
                <p v-if="profileErrors.name" class="text-xs text-error">{{ profileErrors.name }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Username <span class="text-error">*</span></label>
                <input
                  :value="profile.username"
                  @input="profile.username = $event.target.value.replace(/\s/g, '')"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
                  :class="profileErrors.username ? 'border-error' : 'border-border'"
                >
                <p v-if="profileErrors.username" class="text-xs text-error">{{ profileErrors.username }}</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Email</label>
                <input v-model="profile.email" type="email" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm" :class="profileErrors.email ? 'border-error' : 'border-border'">
                <p v-if="profileErrors.email" class="text-xs text-error">{{ profileErrors.email }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">No. Telepon</label>
                <input v-model="profile.phone" type="tel" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm" :class="profileErrors.phone ? 'border-error' : 'border-border'">
                <p v-if="profileErrors.phone" class="text-xs text-error">{{ profileErrors.phone }}</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-foreground">Jabatan</label>
              <input v-model="profile.role" type="text" readonly class="w-full px-4 py-3 rounded-xl border border-border bg-muted text-secondary text-sm cursor-not-allowed">
            </div>
            <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
              <button type="button" @click="resetProfile" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
              <button type="submit" :disabled="isSavingProfile" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                <Save :size="16" />
                <span>{{ isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Password Tab -->
        <div v-show="activeTab === 'password'" class="p-6 md:p-8">
          <div class="max-w-xl mx-auto">
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Info :size="20" class="text-primary flex-shrink-0 mt-0.5" />
              <div class="text-sm text-primary">
                <p class="font-semibold mb-1">Keamanan Kata Sandi</p>
                <p>Gunakan minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka.</p>
              </div>
            </div>

            <form @submit.prevent="changePassword" class="flex flex-col gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Kata Sandi Lama <span class="text-error">*</span></label>
                <div class="relative">
                  <input v-model="passwordForm.oldPassword" :type="showOldPassword ? 'text' : 'password'" placeholder="Masukkan kata sandi lama" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12" :class="passwordErrors.old_password ? 'border-error' : 'border-border'">
                  <button type="button" @click="showOldPassword = !showOldPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showOldPassword" :size="20" /><Eye v-else :size="20" />
                  </button>
                </div>
                <p v-if="passwordErrors.old_password" class="text-xs text-error">{{ passwordErrors.old_password }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Kata Sandi Baru <span class="text-error">*</span></label>
                <div class="relative">
                  <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="Masukkan kata sandi baru" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12" :class="passwordErrors.new_password ? 'border-error' : 'border-border'">
                  <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showNewPassword" :size="20" /><Eye v-else :size="20" />
                  </button>
                </div>
                <p v-if="passwordErrors.new_password" class="text-xs text-error">{{ passwordErrors.new_password }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Konfirmasi Kata Sandi Baru <span class="text-error">*</span></label>
                <div class="relative">
                  <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Masukkan ulang kata sandi baru" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12" :class="passwordErrors.confirm_password ? 'border-error' : 'border-border'">
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showConfirmPassword" :size="20" /><Eye v-else :size="20" />
                  </button>
                </div>
                <p v-if="passwordErrors.confirm_password" class="text-xs text-error">{{ passwordErrors.confirm_password }}</p>
              </div>
              <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
                <button type="button" @click="passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' }; passwordErrors = {}" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
                <button type="submit" :disabled="isSavingPassword" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  <Lock :size="16" />
                  <span>{{ isSavingPassword ? 'Menyimpan...' : 'Ubah Kata Sandi' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Lock, Info, Camera, Eye, EyeOff, Save, CheckCircle, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/axios'

const authStore = useAuthStore()

const activeTab = ref('profile')
const profilePhoto = ref('')
const photoFile = ref(null)
const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const profileErrors = ref({})
const passwordErrors = ref({})
const toast = ref({ message: '', type: 'success' })

const profile = ref({ name: '', username: '', email: '', phone: '', role: '' })
const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => toast.value.message = '', 3000)
}

function getApiErrors(error) {
  if (error.response?.status === 422) return error.response.data.errors ?? {}
  return {}
}

onMounted(async () => {
  // Use cached user immediately to populate form
  if (authStore.user) {
    populateForm(authStore.user)
  }
  // Then fetch fresh data from API
  try {
    await authStore.fetchProfile()
    populateForm(authStore.user)
  } catch {
    // If fetch fails, cached data is still shown
  }
})

function populateForm(user) {
  profile.value = {
    name: user.name ?? '',
    username: user.username ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    role: user.role ?? 'Administrator',
  }
  profilePhoto.value = user.avatar ?? user.photo ?? ''
}

function handlePhotoChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!ALLOWED_TYPES.includes(file.type)) {
    profileErrors.value.photo = 'Format file harus PNG, JPG, atau JPEG'
    event.target.value = ''
    return
  }
  if (file.size > MAX_SIZE) {
    profileErrors.value.photo = 'Ukuran file maksimal 2MB'
    event.target.value = ''
    return
  }

  profileErrors.value.photo = ''
  photoFile.value = file
  profilePhoto.value = URL.createObjectURL(file)
}

function validateProfile() {
  const errs = {}
  if (!profile.value.name.trim()) errs.name = 'Nama lengkap wajib diisi'
  if (!profile.value.username.trim()) errs.username = 'Username wajib diisi'
  profileErrors.value = errs
  return !Object.keys(errs).length
}

function validatePassword() {
  const errs = {}
  if (!passwordForm.value.oldPassword) errs.current_password = 'Kata sandi lama wajib diisi'
  if (!passwordForm.value.newPassword) {
    errs.password = 'Kata sandi baru wajib diisi'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordForm.value.newPassword)) {
    errs.password = 'Minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka'
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errs.password_confirmation = 'Konfirmasi kata sandi tidak cocok'
  }
  passwordErrors.value = errs
  return !Object.keys(errs).length
}

async function saveProfile() {
  if (!validateProfile()) return
  isSavingProfile.value = true
  profileErrors.value = {}
  try {
    const formData = new FormData()
    formData.append('name', profile.value.name)
    formData.append('username', profile.value.username)
    formData.append('email', profile.value.email)
    formData.append('phone', profile.value.phone)
    if (photoFile.value) formData.append('photo', photoFile.value)

    const { data } = await api.post('/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    await authStore.fetchProfile()
    showToast('Profil berhasil diperbarui')
  } catch (error) {
    const errs = getApiErrors(error)
    if (Object.keys(errs).length) {
      profileErrors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
    } else {
      showToast(error.response?.data?.message ?? 'Gagal memperbarui profil', 'error')
    }
  } finally {
    isSavingProfile.value = false
  }
}

async function changePassword() {
  if (!validatePassword()) return
  isSavingPassword.value = true
  passwordErrors.value = {}
  try {
    await api.post('/profile/password', {
      current_password: passwordForm.value.oldPassword,
      password: passwordForm.value.newPassword,
      password_confirmation: passwordForm.value.confirmPassword,
    })
    showToast('Kata sandi berhasil diubah')
    setTimeout(() => authStore.logout(), 1500)
  } catch (error) {
    const res = error.response?.data
    if (error.response?.status === 422 && res?.errors) {
      passwordErrors.value = Object.fromEntries(
        Object.entries(res.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
      )
    } else if (res?.message) {
      passwordErrors.value = { current_password: res.message }
    } else {
      showToast('Gagal mengubah kata sandi', 'error')
    }
  } finally {
    isSavingPassword.value = false
  }
}

function resetProfile() {
  populateForm(authStore.user)
  photoFile.value = null
  profileErrors.value = {}
}
</script>
