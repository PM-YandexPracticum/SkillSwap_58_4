# Checkbox

Управляемый чекбокс для городов, навыков и MultiSelect. Использует готовые иконки `checkbox-empty`, `checkbox-done`, `checkbox-remove`.

```tsx
import { Checkbox } from '@/shared/ui/Checkbox'

<Checkbox label="Москва" checked={checked} onChange={setChecked} />
```

- `checked` и `onChange(checked)` обязательны. Состояние хранит родитель.
- `indeterminate` показывает частичный выбор и устанавливает DOM-свойство `indeterminate`. Скринридер получает состояние `mixed`.
- Из частичного состояния клик или Space передаёт `true`, то есть выбрать всё. Следующее переключение полного выбора передаёт `false`.
- Родитель сбрасывает `indeterminate` после переключения и сам обновляет подкатегории. Расчётов фильтрации внутри Checkbox нет.
- Поддерживает атрибуты HTML-поля: `disabled`, `name`, `value`, `id`, `required`, `aria-*` и другие. В uncontrolled-режиме не используется.
- `error` выводит сообщение, добавляет `aria-invalid` и связывает текст с полем через `aria-describedby`. Внешняя подсказка сохраняется.
- Клик по подписи переключает чекбокс. Tab фокусирует, Space переключает. Disabled пропускается по Tab.
- `className` применяется к внешнему контейнеру.

В папке: компонент и тип пропсов, CSS Module, типизированные stories, тесты поведения и публичный `index.ts`.

Stories: пустой, выбранный, частичный, три варианта disabled, ошибка, hover, focus и живая категория с подкатегориями.

Макет: [обычные фильтры, 1:2861](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2861), [выбранные фильтры, 1:2860](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).
