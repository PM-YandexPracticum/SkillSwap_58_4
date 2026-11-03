// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

/**
 * Правила импортов Feature-Sliced Design (docs/architecture/fsd.md). Задача P1-12.
 * Слои сверху вниз: импортировать можно только из слоёв ниже и только через index.ts слайса.
 */
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities']
const LAYER_ORDER = 'app → pages → widgets → features → entities → shared'
const TEST_FILES = ['src/**/*.test.{ts,tsx}']
const STORY_FILES = ['src/**/*.stories.{ts,tsx}']

/**
 * @param allowAppTest тестам можно импортировать `@/app/test` (renderWithProviders)
 * @param allowTesting тестам и stories можно импортировать фабрики `@/<слой>/<слайс>/testing` (createUser, createSkill)
 */
function fsdImportPatterns(layer, { allowAppTest = false, allowTesting = false } = {}) {
  const index = FSD_LAYERS.indexOf(layer)
  const upperLayers = FSD_LAYERS.slice(0, index).map((upper) => ({
    ...(upper === 'app' && allowAppTest
      ? { regex: '^@/app(?!/test(/|$))(/|$)' }
      : { group: [`@/${upper}`, `@/${upper}/**`] }),
    message: `Слой «${layer}» не может импортировать из «${upper}» — это слой выше. Импорт только вниз: ${LAYER_ORDER}.`,
  }))
  const sameLayer = SLICED_LAYERS.includes(layer)
    ? [
        {
          ...(allowTesting
            ? { regex: `^@/${layer}/(?![^/]+/testing$).+` }
            : { group: [`@/${layer}/**`] }),
          message: `Слайсы слоя «${layer}» не импортируют друг друга. Внутри своего слайса — относительный импорт (./model), общее — вынести слоем ниже.`,
        },
      ]
    : []
  const deepImports = SLICED_LAYERS.slice(SLICED_LAYERS.indexOf(layer) + 1).map((lower) => ({
    ...(allowTesting
      ? { regex: `^@/${lower}/[^/]+/(?!testing$).+` }
      : { group: [`@/${lower}/*/**`] }),
    message: `Импорт из слайса — только через его index.ts: '@/${lower}/<слайс>', а не '@/${lower}/<слайс>/ui/…'. Нужного нет в index.ts — добавь туда экспорт.`,
  }))
  const sharedUi =
    layer === 'shared'
      ? []
      : [
          {
            group: ['@/shared/ui/*/**'],
            message:
              "Компонент shared/ui импортируем по папке: '@/shared/ui/Button', а не '@/shared/ui/Button/Button'.",
          },
        ]
  return [...upperLayers, ...sameLayer, ...deepImports, ...sharedUi]
}

const fsdConfigs = FSD_LAYERS.flatMap((layer) => [
  {
    files: [`src/${layer}/**/*.{ts,tsx}`],
    ignores: [...TEST_FILES, ...STORY_FILES],
    rules: {
      'no-restricted-imports': ['error', { patterns: fsdImportPatterns(layer) }],
    },
  },
  {
    // Исключения для тестов: @/app/test (renderWithProviders) и фабрики @/<слой>/<слайс>/testing (P1-04)
    files: TEST_FILES.map((pattern) => pattern.replace('src/**', `src/${layer}/**`)),
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: fsdImportPatterns(layer, { allowAppTest: true, allowTesting: true }) },
      ],
    },
  },
  {
    // Исключение для stories: фабрики @/<слой>/<слайс>/testing
    files: STORY_FILES.map((pattern) => pattern.replace('src/**', `src/${layer}/**`)),
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: fsdImportPatterns(layer, { allowTesting: true }) },
      ],
    },
  },
])

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      react: reactPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...fsdConfigs,
  eslintConfigPrettier,
  storybook.configs['flat/recommended'],
)
