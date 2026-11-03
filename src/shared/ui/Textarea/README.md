# Textarea

Многострочное поле с подписью, placeholder, ошибкой и необязательной иконкой справа.

## Использование

```tsx
import { Textarea } from '@/shared/ui/Textarea'
import EditIcon from '@/shared/assets/icons/edit.svg?react'

<Textarea
  label="О себе"
  placeholder="Расскажите о себе"
  rightIcon={<EditIcon />}
  error={errors.text?.message}
  {...register('text')}
/>
```

- Поддерживает обычные атрибуты HTML `textarea`: `name`, `value`, `defaultValue`, `onChange`, `onBlur`, `disabled`, `readOnly`, `aria-*` и другие.
- `ref` передаётся на HTML-поле. Работает с `register` из react-hook-form.
- `label` связан с полем через `id`; без явного `id` создаётся уникальный.
- `error` показывает сообщение, добавляет `aria-invalid` и связывает его через `aria-describedby`. Внешняя подсказка в `aria-describedby` сохраняется.
- `rightIcon` является декоративным элементом, скрытым от скринридера. Ввод доступен сразу, иконка не включает режим редактирования. Для кликабельной кнопки, например показа пароля, нужна отдельная обёртка.
- Валидацию выполняет форма. Компонент не устанавливает собственные ограничения длины.
- `className` применяется к самому полю; ширину блока задаёт родитель.

## Файлы

- `Textarea.tsx`: компонент и тип пропсов.
- `Textarea.module.css`: состояния default, hover, focus, disabled и error на токенах проекта.
- `Textarea.stories.tsx`: пустое и заполненное поле, карандаш, ошибка, disabled, hover, focus и пример с react-hook-form.
- `Textarea.test.tsx`: ввод, доступность подписи и ошибки, disabled, ref и интеграция с формой.
- `index.ts`: публичный API.

Макет: [регистрация](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548), [ошибка](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627), [личные данные](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370).
