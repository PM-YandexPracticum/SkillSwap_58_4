# src/features/register/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `register` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** StepCredentials готов как вёрстка P3-11, StepProfile готов как вёрстка P3-12, StepSkill готов как вёрстка P3-13. Валидацию, уникальность email и сохранение подключат задачи фазы 6.

## Что внутри

- `StepCredentials.tsx` — email, пароль с подсказкой, «Далее», ссылка «Войти». Передаёт CredentialsValues в onNext, принимает emailError; проверки и сохранение не выполняет. OAuthButtons подключает страница
- `StepProfile.tsx` — Шаг 2 «Расскажите немного о себе»: аватар (кружок с «+»), Имя, Дата рождения (DatePicker) + Пол (Select: Не указан / Мужской / Женский) в одну строку, Город (Select с поиском), «Категория навыка, которому хотите научиться» и «Подкатегория…» — CategorySubcategorySelect в режиме `multiple` (списки с чекбоксами). «Назад» / «Продолжить». «О себе» здесь нет — только в профиле
- `StepSkill.tsx` — Шаг 3 «Укажите, чем вы готовы поделиться»: колонка формы со слотами `skillForm` (`SkillForm` из features/skill-create) и `previewModal` (`SkillPreviewModal`). Слайсы features не импортируют друг друга, поэтому слоты подставляет страница. Иллюстрация и подпись «Так другие люди смогут увидеть ваши предложения и предложить вам обмен!» справа — в RegisterLayout

- `StepProfile.module.css` — геометрия второго шага и строки даты/пола.
- `StepProfile.test.tsx` — поля, выбор значений, клик/Enter без нативной отправки формы.

- `StepCredentials.test.tsx` — отправка кликом/Enter, ошибка email, подсказка и видимость пароля
- `StepCredentials.stories.tsx` — обычное состояние и ошибка email 1:2627

- `StepSkill.module.css` — ширина и отступ колонки шага
- `StepSkill.test.tsx` — слоты формы и окна
