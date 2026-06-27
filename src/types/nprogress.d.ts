declare module 'nprogress' {
  interface NProgressOptions {
    minimum?: number
    template?: string
    easing?: string
    speed?: number
    trickle?: boolean
    trickleSpeed?: number
    showSpinner?: boolean
    barSelector?: string
    spinnerSelector?: string
    parent?: string
  }

  interface NProgress {
    version: string
    settings: NProgressOptions
    status: number | null
    configure(options: NProgressOptions): NProgress
    set(number: number): NProgress
    isStarted(): boolean
    start(): NProgress
    done(force?: boolean): NProgress
    inc(amount?: number): NProgress
    trickle(): NProgress
    remove(): void
  }

  const NProgress: NProgress
  export default NProgress
}
