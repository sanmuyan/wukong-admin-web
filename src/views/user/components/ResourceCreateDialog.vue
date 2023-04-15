<template>
  <el-dialog @close="closed" width="500px" draggable title="资源创建">
    <el-form :model="resource" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="路径" label-width="100px" prop="resource_path" >
        <el-input v-model="resource.resource_path"></el-input>
      </el-form-item>
      <el-form-item label="鉴权" label-width="100px" prop="is_auth">
        <el-select v-model="resource.is_auth" placeholder="是否鉴权">
          <el-option v-for="item in authOptions" :key="item.value" :value=item.value :label=item.label />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="resource.comment"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="handleCreateResource">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

const resource = ref({
  is_auth: 1
})

const formRef = ref(null)
const formRules = ref({
  resource_path: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  is_auth: [
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

const emits = defineEmits(['update:modelValue', 'updateOk'])

const authOptions = ref(
  [{
    value: 0,
    label: '不鉴权'
  }, {
    value: 1,
    label: '鉴权'
  }])

const handleCreateResource = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createResource()
    }
  })
}

const createResource = async () => {
  await restFull('/resource', 'POST', {
    resource_path: resource.value.resource_path,
    is_auth: Number(resource.value.is_auth),
    comment: resource.value.comment
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
    })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  resource.value = { is_auth: 1 }
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
