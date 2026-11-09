# DatePicker

Поле даты рождения на основе `Input` и `react-datepicker`. Дату можно ввести в формате `дд.мм.гггг` или выбрать в календаре. На выходе строка `YYYY-MM-DD` без времени или `null`, если допустимой даты пока нет.

Календарь открывается кнопкой с иконкой или стрелкой вниз из поля. Списки месяца и года меняют видимый месяц. Выбранный день применяется кнопкой «Выбрать». «Отменить», Escape и клик снаружи отбрасывают выбор в календаре. Неделя начинается с понедельника, названия русские.

`min` и `max` задают включительные границы. Форма передаёт границы и собственный текст ошибки. `disabled` отключает поле и кнопку календаря. Внешнее изменение `value` закрывает календарь и отбрасывает прежний черновик.

## React Hook Form

```tsx
const { control, reset } = useForm({ defaultValues: { birthDate: null } })
const [resetKey, setResetKey] = useState(0)

function resetForm() {
  reset({ birthDate: null })
  setResetKey(key => key + 1)
}

<Controller
  name="birthDate"
  control={control}
  render={({ field, fieldState }) => (
    <DatePicker
      {...field}
      resetKey={resetKey}
      label="Дата рождения"
      min={earliestBirthDate}
      max={latestBirthDate}
      error={fieldState.error?.message}
    />
  )}
/>
```

Начальное значение поля в `defaultValues` — `null` или дата в ISO. Компонент передаёт `ref` на текстовое поле и вызывает `onBlur`, когда фокус покидает компонент.

В Storybook есть пустое и заполненное поля, hover, focus, disabled, ошибка, открытый календарь и пример с формой. Макет [«Регистрация 2 шаг» (1:1541)](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1541).


`resetKey` — необязательный сигнал сброса: меняйте его вместе с `reset()` формы.
Он очищает ручной текст, ошибку ввода и черновик даже при повторном `null`.
Без изменения `value` или `resetKey` компонент сохраняет незавершённый ввод при обычном рендере.
Возрастные ограничения и yup-схема принадлежат форме: DatePicker применяет только переданные `min`/`max`.

## Что внутри

- `DatePicker.tsx` — поле, подтверждение/отмена, синхронизация с формой и фокус.
- `DatePickerCalendar.tsx` — библиотечная сетка, русская локаль и начальный фокус.
- `CalendarHeader.tsx` — списки месяца и года с ограничением граничных месяцев.
- `dateUtils.ts` — строгий разбор и включительные границы дат; `dateUtils.test.ts` — проверки календарных границ.
- `DatePicker.module.css` — стили только внутри компонента; панель 280 × 360 px, шапка 40 px и стрелки 24 px по Figma.
- `DatePicker.test.tsx` — ввод, подтверждение, отмена, внешние изменения/сброс, disabled, клавиатура и Controller в режиме onBlur.
- `DatePicker.stories.tsx` — состояния поля и календаря, форма с валидацией по потере фокуса и явным сбросом.
- `index.ts` — публичные DatePicker и DatePickerProps; вспомогательные компоненты остаются внутренними.

`date-fns` объявлена прямой зависимостью: компонент использует её независимо от внутренностей `react-datepicker`.
