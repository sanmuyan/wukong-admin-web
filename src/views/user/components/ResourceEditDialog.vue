<template>
  <el-dialog @close="closed" :model-value="modelValue" width="500px" draggable title="资源编辑">
    <el-form :model="resource" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="路径" label-width="100px" prop="resource_path">
        <el-input v-model="resource.resource_path" disabled></el-input>
      </el-form-item>
      <el-form-item label="鉴权" label-width="100px" prop="is_auth">
        <el-select v-model="resource.is_auth" placeholder="鉴权">
          <el-option v-for="item in authOptions" :key="item.value" :value=item.value :label=item.label />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="resource.comment"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="handleUpdateResource">提交</el-button>
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
  resourceEdit: {
    type: Object,
    required: true
  }
})

const authOptions = ref(
  [{
    value: 2,
    label: '不鉴权'
  }, {
    value: 1,
    label: '鉴权'
  }])

const resource = ref({})

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

const getResource = () => {
  resource.value = props.resourceEdit
}

const handleUpdateResource = () => {
  formRef.value.validate(valid => {
    if (valid) {
      updateResource()
    }
  })
}

const updateResource = async () => {
  await restFull('/resource', 'PUT', resource.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
    })
  closed()
}

watch(
  () => props.modelValue,
  val => {
    if (val) getResource()
  }
)

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  resource.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
