# Input

Однострочное поле с подписью, placeholder, ошибкой и необязательной иконкой справа.

## Использование

```tsx
import { Input } from '@/shared/ui/Input'
import EditIcon from '@/shared/assets/icons/edit.svg?react'

<Input
  label="Имя"
  placeholder="Введите ваше имя"
  rightIcon={<EditIcon />}
  error={errors.text?.message}
  {...register('text')}
/>
```

- Поддерживает обычные атрибуты HTML `input`: `name`, `value`, `defaultValue`, `onChange`, `onBlur`, `disabled`, `readOnly`, `aria-*` и другие.
- `ref` передаётся на HTML-поле. Работает с `register` из react-hook-form.
- `label` связан с полем через `id`; без явного `id` создаётся уникальный.
- `error` показывает сообщение, добавляет `aria-invalid` и связывает его через `aria-describedby`. Внешняя подсказка в `aria-describedby` сохраняется.
- `rightIcon` является декоративным элементом, скрытым от скринридера. Ввод доступен сразу, иконка не включает режим редактирования.
- `rightAction` — кнопка на том же месте справа: «глаз» в PasswordInput (P2-06), «×» очистки у «Города» в Select (P2-09). Кликается и доступна с клавиатуры (Tab после поля); подпись для скринридера задаёт сама кнопка (`aria-label`). Если передан `rightAction`, `rightIcon` не показывается.
- Высота поля — 48 px вместе с рамкой, как в макете.
- Валидацию выполняет форма. Компонент не устанавливает собственные ограничения длины.
- `className` применяется к самому полю; ширину блока задаёт родитель.

## Файлы

- `Input.tsx`: компонент и тип пропсов.
- `../Field/Field.module.css`: общие состояния default, hover, focus, disabled и error на токенах проекта.
- `Input.stories.tsx`: пустое и заполненное поле, карандаш, кнопка справа («×» очистки), ошибка, disabled, hover, focus и пример с react-hook-form.
- `Input.test.tsx`: ввод, доступность подписи и ошибки, disabled, ref, кнопка справа и интеграция с формой.
- `index.ts`: публичный API.

Макет: [регистрация](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548), [ошибка](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627), [личные данные](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370).

Подпись и ошибка переиспользуют [Field](../Field/README.md). Общие состояния поля лежат в
`Field.module.css` и подключаются напрямую; ref, HTML-атрибуты и различия
однострочного/многострочного ввода остаются в конкретном компоненте.
