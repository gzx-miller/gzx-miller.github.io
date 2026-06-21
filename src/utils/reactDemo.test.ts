import { describe, expect, it } from 'vitest'
import { createReactDemoDocument } from './reactDemo'

describe('createReactDemoDocument', () => {
  it('creates an isolated React 19 module document and escapes script endings', () => {
    const document = createReactDemoDocument('console.log("</script>")')

    expect(document).toContain('react@19.2.0')
    expect(document).toContain('"react-dom":"https://esm.sh/react-dom@19.2.0?dev"')
    expect(document).toContain('react-dom@19.2.0/client')
    expect(document).toContain('zustand@5.0.14')
    expect(document).toContain('jotai@2.20.1')
    expect(document).toContain('@reduxjs/toolkit@2.12.0')
    expect(document).toContain('xstate@5.32.1')
    expect(document).toContain('type="importmap"')
    expect(document).toContain('<\\/script>')
    expect(document).not.toContain('console.log("</script>")')
  })
})
