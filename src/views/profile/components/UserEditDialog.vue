<template>
  <el-dialog @close="closed" :model-value="modelValue" width="500px" draggable title="用户编辑">
    <el-form style="width: 380px">
      <el-form-item label="用户名" label-width="100px">
        <el-input v-model="user.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="显示名" label-width="100px">
        <el-input v-model="user.display_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="100px">
        <el-input v-model="user.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="user.email" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="100px">
        <el-input v-model="user.mobile" disabled></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="updateUser">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

// 父组件传入的值
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userEdit: {
    type: Object,
    required: true
  }
})
const user = ref({})
const emits = defineEmits(['update:modelValue', 'updateOk'])

const getUser = async () => {
  user.value = props.userEdit
}

watch(
  () => props.modelValue,
  val => {
    if (val) getUser()
  }
)

const updateUser = async () => {
  await restFull('/user/profile', 'PUT', {
    id: user.value.id,
    username: user.value.username,
    display_name: user.value.display_name,
    password: user.value.password,
    email: user.value.email,
    mobile: user.value.mobile
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
    })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  user.value = {}
}

</script>

<style scoped>

</style>
