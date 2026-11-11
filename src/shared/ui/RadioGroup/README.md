# RadioGroup

Управляемая группа нативных радиокнопок для режима обмена и пола автора. Использует готовые иконки `radio-empty` и `radio-done`.

```tsx
import { RadioGroup } from '@/shared/ui/RadioGroup'

<RadioGroup
  name="mode"
  aria-label="Режим обмена"
  options={[
    { value: 'all', label: 'Всё' },
    { value: 'learn', label: 'Хочу научиться' },
    { value: 'teach', label: 'Могу научить' },
  ]}
  value={mode}
  onChange={setMode}
/>
```

- `name`, `options`, `value` и `onChange(value)` обязательны. Состояние хранит родитель.
- У разных групп должны быть разные `name`, чтобы нативные радиокнопки не влияли друг на друга.
- `label` выводится как `legend`, например «Пол автора» — по макету шрифтом заголовков Jost Medium 20/24 с отступом 20 px до вариантов. Если видимая подпись не нужна, передайте `aria-label` или `aria-labelledby`.
- Tab входит в выбранный пункт, следующий Tab покидает группу. Стрелки меняют фокус и выбор по кругу; отключённые пункты пропускаются. Space выбирает пункт в фокусе. Это поведение нативных HTML-полей, собственного обработчика клавиш нет.
- `disabled` отключает всю группу. `options[].disabled` отключает отдельный пункт.
- `error` выводит сообщение и связывает его с группой через `aria-describedby`, добавляет `aria-invalid`. Внешняя подсказка сохраняется.
- Поддерживает атрибуты HTML `fieldset`, `aria-*` и `className` для внешнего контейнера.

В папке: компонент и тип пропсов, CSS Module, типизированные stories, тесты поведения и публичный `index.ts`.

Stories: три режима, пол автора, disabled группы и пункта, ошибка, hover и focus. Выбор в stories меняется кликом и клавиатурой.

Макет: [обычные фильтры, 1:2861](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2861), [выбранные фильтры, 1:2860](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).

Тип `RadioGroupProps<Value>` сохраняет union значений от списка вариантов до `onChange`.
Обработчик получает значение из типизированного варианта, а не произвольную строку DOM.
Фильтр пола переводит свой пункт `any` в доменное значение `null`.
