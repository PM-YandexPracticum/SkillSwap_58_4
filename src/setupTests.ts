import '@testing-library/jest-dom'

import { resetMockDb } from '@/shared/api'

// После каждого теста — чистый браузер: изменения «базы», сессия и тема не переходят в следующий тест
afterEach(() => {
  localStorage.clear()
  resetMockDb()
})
