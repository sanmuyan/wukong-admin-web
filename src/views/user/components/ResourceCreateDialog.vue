<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="资源创建">
    <el-form :model="resource" :rules="formRules" ref="formRef" style="width: 380px" >
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
      <el-button type="primary" size="small" @click="handleButtonClosed">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonApply">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { defineModel, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const getResources = inject('getResources')

const resource = ref({
  is_auth: 1
})

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

const authOptions = ref(
  [{
    value: 2,
    label: '不鉴权'
  }, {
    value: 1,
    label: '鉴权'
  }])

const createResource = async () => {
  await restFull('/resource', 'POST', {
    resource_path: resource.value.resource_path,
    is_auth: Number(resource.value.is_auth),
    comment: resource.value.comment
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
      closed()
      getResources()
    })
}

const handleButtonApply = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createResource()
    }
  })
}

const handleButtonClosed = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  resource.value = { is_auth: 1 }
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
