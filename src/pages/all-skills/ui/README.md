# src/pages/all-skills/ui

## Что внутри

- `AllSkillsPage.tsx` — единственная основная область страницы с общим CategoriesMenu. `h1` «Все навыки» скрыт визуально: в Figma нет видимого заголовка, скринридер получает название страницы.
- `AllSkillsPage.module.css` — отступ 20 px сверху и 60 px перед Footer; скрытие h1 без удаления из дерева доступности.
- `AllSkillsPage.test.tsx` — основная область, h1 и шесть категорий; Header/Footer не дублируются.

[Макет — 1:3165](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-3165).
Открытие меню, Esc, Tab и переход из Footer проверяются интеграционно в `src/app/layouts/MainLayout.test.tsx`.
