<template>
  <div class="flex-1 p-5 md:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="border-b border-border">
          <div class="flex gap-1 p-2">
            <button @click="activeTab = 'profile'" :class="activeTab === 'profile' ? 'bg-primary text-white' : 'text-secondary hover:bg-muted'" class="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <User :size="16" class="inline-block mr-2" />
              Ubah Profil
            </button>
            <button @click="activeTab = 'password'" :class="activeTab === 'password' ? 'bg-primary text-white' : 'text-secondary hover:bg-muted'" class="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <Lock :size="16" class="inline-block mr-2" />
              Ubah Kata Sandi
            </button>
          </div>
        </div>

        <div v-show="activeTab === 'profile'" class="p-6 md:p-8">
          <div class="flex flex-col items-center mb-8">
            <div class="relative">
              <img :src="profilePhoto" class="size-32 rounded-full object-cover border-4 border-border shadow-lg">
              <label class="absolute bottom-0 right-0 size-10 bg-primary hover:bg-primary-hover rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                <Camera :size="20" class="text-white" />
                <input type="file" @change="handlePhotoChange" accept="image/*" class="hidden">
              </label>
            </div>
            <p class="text-sm text-secondary mt-4">Klik ikon kamera untuk mengubah foto</p>
          </div>

          <form @submit.prevent="saveProfile" class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Nama Lengkap <span class="text-error">*</span></label>
                <input v-model="profile.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Username <span class="text-error">*</span></label>
                <input v-model="profile.username" type="text" required class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Email</label>
                <input v-model="profile.email" type="email" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">No. Telepon</label>
                <input v-model="profile.phone" type="tel" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-foreground">Jabatan</label>
              <input v-model="profile.role" type="text" readonly class="w-full px-4 py-3 rounded-xl border border-border bg-muted text-secondary text-sm cursor-not-allowed">
            </div>
            <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
              <button type="button" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
              <button type="submit" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm">
                <Save :size="16" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

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
                  <input v-model="passwordForm.oldPassword" :type="showOldPassword ? 'text' : 'password'" required placeholder="Masukkan kata sandi lama" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12">
                  <button type="button" @click="showOldPassword = !showOldPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showOldPassword" :size="20" />
                    <Eye v-else :size="20" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Kata Sandi Baru <span class="text-error">*</span></label>
                <div class="relative">
                  <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'" required placeholder="Masukkan kata sandi baru" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12">
                  <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showNewPassword" :size="20" />
                    <Eye v-else :size="20" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-foreground">Konfirmasi Kata Sandi Baru <span class="text-error">*</span></label>
                <div class="relative">
                  <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required placeholder="Masukkan ulang kata sandi baru" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm pr-12">
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors">
                    <EyeOff v-if="showConfirmPassword" :size="20" />
                    <Eye v-else :size="20" />
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
                <button type="button" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm">
                  <Lock :size="16" />
                  <span>Ubah Kata Sandi</span>
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
import { ref } from 'vue'
import { User, Lock, Info, Camera, Eye, EyeOff, Save } from 'lucide-vue-next'

const activeTab = ref('profile')
const profilePhoto = ref('https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop')

const profile = ref({
  name: 'Admin Keuangan',
  username: 'admin',
  email: 'admin@madarijussalikin.sch.id',
  phone: '081234567890',
  role: 'Administrator'
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePhoto.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = () => {
  alert('Profil berhasil diperbarui!')
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Kata sandi baru dan konfirmasi tidak cocok!')
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    alert('Kata sandi minimal 8 karakter!')
    return
  }
  alert('Kata sandi berhasil diubah!')
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}
</script>
