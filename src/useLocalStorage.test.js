import { useLocalStorage } from './'
import { renderHook, cleanup, act } from '@testing-library/react-hooks'

afterEach(() => {
  cleanup()
})

describe('useLocalStorage()', () => {
  it('should render without errors', () => {
    const { result } = renderHook(() => useLocalStorage())
    expect(result.current).toBeTruthy()
  })

  it('should return an array, with a length of 2.', () => {
    const { result } = renderHook(() => useLocalStorage())
    expect(result.current).toHaveLength(2)
  })

  it('should return the new value when `setValueInLocalStorage` is called', () => {
    const { result } = renderHook(() => useLocalStorage())
    act(() => result.current[1]('test'))
    expect(result.current[0]).toContain('test')
  })

  it('should return the local storage value when there is one present', () => {
    window.localStorage.setItem('name', 'test')
    const { result } = renderHook(() => useLocalStorage())
    expect(result.current).toContain('test')
  })

  describe('local storage activity', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      })
    })

    afterEach(cleanup)

    it('Should call localStorage.getItem on render', () => {
      const { result } = renderHook(() => useLocalStorage(('name': 'rick')))
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1)
    })

    it('Should call localStorage.setItem when `setValueInLocalStorage` is called', () => {
      const { result } = renderHook(() => useLocalStorage())
      act(() => result.current[1]('test'))
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(1)
    })
  })
})
