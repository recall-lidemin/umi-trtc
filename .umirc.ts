import { defineConfig } from 'umi'

const BASE_PATH = '/web-rtc/'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: BASE_PATH,
  base: BASE_PATH,
  favicon: `${BASE_PATH}favicon.png`,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
})
