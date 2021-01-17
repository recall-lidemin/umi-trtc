declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement
  const url: string
  export default url
}
declare module 'trtc-js-sdk'
declare module '@/assets/lib/js/lib-generate-test-usersig.min.js'
