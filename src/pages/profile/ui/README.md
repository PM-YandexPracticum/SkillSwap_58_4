# Разделы личного кабинета

- `ProfilePage.tsx` соединяет ProfileSidebar и Outlet. Оформление страницы — `ProfilePage.module.css`.
- `ProfilePersonal.tsx` получает текущего пользователя из store и соединяет ProfileForm с AvatarUpload через слот. Страница не хранит второй черновик. Ключ пользователя сбрасывает поля, пароль и фото при смене аккаунта; без пользователя редактор не показывается.
- `ProfileRequests.tsx`, `ProfileExchanges.tsx`, `ProfileFavorites.tsx` и `ProfileSkills.tsx` используют общий `ProfileStub.tsx` с сообщением «Раздел в разработке». Это граница MVP; рабочее избранное вынесено на `/favorites`.
- `ProfilePersonal.test.tsx` проверяет заполнение формы, ошибки, пароль, фото, сохранение и повтор после ошибки, сохранность связей, блокировку записи и смену пользователя.
- `ProfilePage.stories.tsx` и `ProfilePersonal.stories.tsx` показывают кабинет и редактор профиля по Figma 1:2370.

Проверки и сохранение принадлежат feature `profile-edit`, обработка изображения — `avatar-upload`, запись пользователя — API `entities/user`. Страница только соединяет эти части.
