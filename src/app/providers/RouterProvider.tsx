import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PROFILE_ROUTES, ROUTER_FUTURE, ROUTES } from '@/shared/config'
import { Loader } from '@/shared/ui/Loader'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/MainLayout'
import { RegisterStepGuard } from '@/app/router/RegisterStepGuard'
import { RequireAuth } from '@/app/router/RequireAuth'
import {
  ProfileExchanges,
  ProfileFavorites,
  ProfilePersonal,
  ProfileRequests,
  ProfileSkills,
} from '@/pages/profile'
import {
  RegisterLayout,
  RegisterStep1Page,
  RegisterStep2Page,
  RegisterStep3Page,
} from '@/pages/register'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })))
const SkillPage = lazy(() => import('@/pages/skill').then((m) => ({ default: m.SkillPage })))
const FavoritesPage = lazy(() =>
  import('@/pages/favorites').then((m) => ({ default: m.FavoritesPage })),
)
const ProfilePage = lazy(() => import('@/pages/profile').then((m) => ({ default: m.ProfilePage })))
const AboutPage = lazy(() => import('@/pages/about').then((m) => ({ default: m.AboutPage })))
const LoginPage = lazy(() => import('@/pages/login').then((m) => ({ default: m.LoginPage })))
const AllSkillsPage = lazy(() =>
  import('@/pages/all-skills').then((m) => ({ default: m.AllSkillsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
)
const ServerErrorPage = lazy(() =>
  import('@/pages/server-error').then((m) => ({ default: m.ServerErrorPage })),
)

export function AppRouter() {
  return (
    <BrowserRouter future={ROUTER_FUTURE}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
            <Route
              path={ROUTES.FAVORITES}
              element={
                <RequireAuth>
                  <FavoritesPage />
                </RequireAuth>
              }
            />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.ALL_SKILLS} element={<AllSkillsPage />} />

            <Route
              path={ROUTES.PROFILE}
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to={PROFILE_ROUTES.PERSONAL} replace />} />
              <Route path={PROFILE_ROUTES.REQUESTS} element={<ProfileRequests />} />
              <Route path={PROFILE_ROUTES.EXCHANGES} element={<ProfileExchanges />} />
              <Route path={PROFILE_ROUTES.FAVORITES} element={<ProfileFavorites />} />
              <Route path={PROFILE_ROUTES.SKILLS} element={<ProfileSkills />} />
              <Route path={PROFILE_ROUTES.PERSONAL} element={<ProfilePersonal />} />
            </Route>

            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterLayout />}>
              <Route index element={<Navigate to={ROUTES.REGISTER_STEP_1} replace />} />
              <Route path={ROUTES.REGISTER_STEP_1} element={<RegisterStep1Page />} />
              <Route
                path={ROUTES.REGISTER_STEP_2}
                element={
                  <RegisterStepGuard step={2}>
                    <RegisterStep2Page />
                  </RegisterStepGuard>
                }
              />
              <Route
                path={ROUTES.REGISTER_STEP_3}
                element={
                  <RegisterStepGuard step={3}>
                    <RegisterStep3Page />
                  </RegisterStepGuard>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
