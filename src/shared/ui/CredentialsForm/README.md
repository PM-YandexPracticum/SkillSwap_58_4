# CredentialsForm

Общая вёрстка формы email и пароля для входа и первого шага регистрации.
Использует готовые `Input`, `PasswordInput`, `Button`. Не содержит react-hook-form, схем, запросов или сохранения.

- `CredentialsForm.tsx` — компонент и `CredentialsFormProps`; импорт через `index.ts`.
- `CredentialsForm.module.css` — отступы полей, общей ошибки и действий, оформление навигации.
- `CredentialsForm.test.tsx` — обработчики полей и отправки, независимые связи ошибок нескольких форм.
- `CredentialsForm.stories.tsx` — вход, общая ошибка, регистрация, занятый email.

`emailInput` и `passwordInput` принимают атрибуты полей и ref, включая результат `register()` из react-hook-form.
`label` — доступное название формы, `submitLabel` — подпись основной кнопки, `onSubmit` — обработчик формы.
`children` — навигация под кнопкой. Формат и уникальность значений проверяет вызывающая фича в следующих задачах.

`error` помечает оба поля как неверные и выводит общую ошибку один раз через `role="alert"`.
Дополнительные описания из `aria-describedby` полей сохраняются и при общей ошибке, и после её снятия.
Для ошибки отдельного поля используется `emailInput.error` / `passwordInput.error` из публичного API полей.

Figma: [вход 1:2400](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400),
[общая ошибка 1:2473](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2473),
[шаг 1 1:2548](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548),
[ошибка email 1:2627](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627).
