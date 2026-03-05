import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'

// Mock React for node environment
vi.mock('react', () => ({
  default: {
    createElement: vi.fn(),
    Fragment: vi.fn(),
  },
  createElement: vi.fn(),
  Fragment: vi.fn(),
  useState: vi.fn(),
  useEffect: vi.fn(),
  useCallback: vi.fn(),
  useMemo: vi.fn(),
  useRef: vi.fn(),
}))

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
