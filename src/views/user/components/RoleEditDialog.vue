<template>
  <el-dialog @close="closed" :model-value="modelValue" width="500px" draggable title="角色编辑">
    <el-form :model="role" ref="formRef" :rules="formRules" style="width: 380px">
      <el-form-item label="角色" label-width="100px" prop="role_name">
        <el-input v-model="role.role_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="等级" label-width="100px" prop="access_level">
        <el-input v-model="role.access_level"></el-input>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="role.comment"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="handleUpdateRole">提交</el-button>
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
  roleEdit: {
    type: Object,
    required: true
  }
})
const role = ref({})

const emits = defineEmits(['update:modelValue', 'updateOk'])

const formRef = ref(null)

const formRules = ref({
  role_name: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  access_level: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  comment: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const getRole = async () => {
  role.value = props.roleEdit
}

const handleUpdateRole = () => {
  formRef.value.validate(valid => {
    if (valid) {
      updateRole()
    }
  })
}

const updateRole = async () => {
  await restFull('/role', 'PUT', role.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
    })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  role.value = {}
  formRef.value.clearValidate()
}

watch(
  () => props.modelValue,
  val => {
    if (val) getRole()
  }
)

</script>

<style scoped>

</style>
