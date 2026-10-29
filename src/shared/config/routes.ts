/** Маршруты приложения. В коде — только эти константы, никаких строк '/profile'. */
export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  /** Страница «Все навыки» — ссылка из футера (в шапке «Все навыки» — выпадающее меню) */
  ALL_SKILLS: '/skills',
  FAVORITES: '/favorites',
  /** «О проекте» — страница команды */
  ABOUT: '/about',
  PROFILE: '/profile',
  LOGIN: '/login',
  /** Регистрация — три отдельных маршрута; `/register` ведёт на первый шаг */
  REGISTER: '/register',
  REGISTER_STEP_1: '/register/step-1',
  REGISTER_STEP_2: '/register/step-2',
  REGISTER_STEP_3: '/register/step-3',
  SERVER_ERROR: '/500',
} as const

/** Вложенные (относительные) маршруты личного кабинета `/profile/*` */
export const PROFILE_ROUTES = {
  REQUESTS: 'requests',
  EXCHANGES: 'exchanges',
  FAVORITES: 'favorites',
  SKILLS: 'skills',
  PERSONAL: 'personal',
} as const

/** Собирает путь к странице навыка */
export function getSkillRoute(id: string): string {
  return ROUTES.SKILL.replace(':id', id)
}
