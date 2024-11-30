import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { ProtectedAuth, ProtectedLayout } from "../components/ProtectAuth";

const LoginPage = lazy(() => import('../page/LoginPage'));
const ContractsPage = lazy(() => import('../page/ContractsPage'));

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Suspense
        fallback={
          <p className="text-center text-[32px] mt-10">Loading...</p>
        }>
        <ProtectedAuth>
          <LoginPage />
        </ProtectedAuth>
      </Suspense>} />
      <Route path="/" element={<Suspense fallback={
        <p className="text-center text-[32px] mt-10">Loading...</p>
      }>
        <ProtectedLayout>
          <ContractsPage />
        </ProtectedLayout>
      </Suspense>} />
    </Routes>
  )
}

export default CustomRoutes
