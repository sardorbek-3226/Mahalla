import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@/constants/roles';
import { PERMISSIONS } from '@/constants/permissions';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleRoute from './RoleRoute';
import PermissionRoute from './PermissionRoute';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import { NotFound, Forbidden, ServerError } from '@/pages/errors/ErrorPage';

// --- Lazy pages (code splitting) ---------------------------------------------
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const VerifyOtp = lazy(() => import('@/pages/auth/VerifyOtp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

// Static info / legal pages
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Faq = lazy(() => import('@/pages/public/Faq'));
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const Terms = lazy(() => import('@/pages/public/Terms'));

// Feature pages
const Workers = lazy(() => import('@/pages/features/Workers'));
const WorkerDetail = lazy(() => import('@/pages/features/WorkerDetail'));
const Categories = lazy(() => import('@/pages/features/Categories'));
const Services = lazy(() => import('@/pages/features/Services'));
const Bookings = lazy(() => import('@/pages/features/Bookings'));
const BookingNew = lazy(() => import('@/pages/features/BookingNew'));
const BookingDetail = lazy(() => import('@/pages/features/BookingDetail'));
const Chat = lazy(() => import('@/pages/features/Chat'));
const Notifications = lazy(() => import('@/pages/features/Notifications'));
const News = lazy(() => import('@/pages/features/News'));
const Events = lazy(() => import('@/pages/features/Events'));
const Complaints = lazy(() => import('@/pages/features/Complaints'));
const Reviews = lazy(() => import('@/pages/features/Reviews'));
const Payments = lazy(() => import('@/pages/features/Payments'));
const Family = lazy(() => import('@/pages/features/Family'));
const Documents = lazy(() => import('@/pages/features/Documents'));
const Emergency = lazy(() => import('@/pages/features/Emergency'));
const Profile = lazy(() => import('@/pages/features/Profile'));
const Settings = lazy(() => import('@/pages/features/Settings'));
const Search = lazy(() => import('@/pages/features/Search'));
const AdminUsers = lazy(() => import('@/pages/features/admin/AdminUsers'));
const AdminWorkers = lazy(() => import('@/pages/features/admin/AdminWorkers'));
const AdminManagement = lazy(() => import('@/pages/features/admin/AdminManagement'));
const AuditLogs = lazy(() => import('@/pages/features/admin/AuditLogs'));
const CategoriesAdmin = lazy(() => import('@/pages/features/admin/CategoriesAdmin'));
const LocationsAdmin = lazy(() => import('@/pages/features/admin/LocationsAdmin'));
const Analytics = lazy(() => import('@/pages/features/admin/Analytics'));
const Reports = lazy(() => import('@/pages/features/admin/Reports'));
const ProviderServices = lazy(() => import('@/pages/features/provider/ProviderServices'));
const ProviderDocuments = lazy(() => import('@/pages/features/provider/ProviderDocuments'));
const OAuthCallback = lazy(() => import('@/pages/auth/OAuthCallback'));

const CitizenDashboard = lazy(() => import('@/pages/dashboards/CitizenDashboard'));
const WorkerDashboard = lazy(() => import('@/pages/dashboards/WorkerDashboard'));
const OrganizationDashboard = lazy(() => import('@/pages/dashboards/OrganizationDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboards/AdminDashboard'));

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />

    {/* Static info / legal pages (with public navbar + footer) */}
    <Route element={<PublicLayout />}>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Route>

    {/* OAuth redirect target (no guard — captures tokens then redirects) */}
    <Route path="/auth/callback" element={<OAuthCallback />} />

    {/* Auth (redirect away if already logged in) */}
    <Route element={<PublicRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Route>

    {/* Protected app shell */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        {/* Role dashboards */}
        <Route element={<RoleRoute allow={[ROLES.CITIZEN]} />}>
          <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.WORKER]} />}>
          <Route path="/dashboard/worker" element={<WorkerDashboard />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.ORGANIZATION]} />}>
          <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
        </Route>

        {/* Provider (worker) workspace */}
        <Route element={<RoleRoute allow={[ROLES.WORKER]} />}>
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/provider/documents" element={<ProviderDocuments />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.MAHALLA_ADMIN]} />}>
          <Route path="/dashboard/mahalla" element={<AdminDashboard />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.DISTRICT_ADMIN]} />}>
          <Route path="/dashboard/district" element={<AdminDashboard />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.REGION_ADMIN]} />}>
          <Route path="/dashboard/region" element={<AdminDashboard />} />
        </Route>
        <Route element={<RoleRoute allow={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        {/* Shared feature pages */}
        <Route path="/workers" element={<Workers />} />
        <Route path="/workers/:id" element={<WorkerDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/new" element={<BookingNew />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/family" element={<Family />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />

        {/* Admin-only feature pages */}
        <Route element={<RoleRoute allow={[ROLES.MAHALLA_ADMIN, ROLES.DISTRICT_ADMIN, ROLES.REGION_ADMIN, ROLES.SUPER_ADMIN]} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Admin account management — only roles that can assign/create admins */}
        <Route element={<PermissionRoute require={[PERMISSIONS.ROLES_ASSIGN]} />}>
          <Route path="/admin/management" element={<AdminManagement />} />
        </Route>
        {/* Audit logs — Super Admin only */}
        <Route element={<PermissionRoute require={[PERMISSIONS.AUDIT_LOGS_VIEW]} />}>
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
        {/* Platform config (categories, regions, mahallas) — Super Admin only */}
        <Route element={<PermissionRoute require={[PERMISSIONS.PLATFORM_SETTINGS_MANAGE]} />}>
          <Route path="/admin/categories" element={<CategoriesAdmin />} />
          <Route path="/admin/locations" element={<LocationsAdmin />} />
        </Route>
      </Route>
    </Route>

    {/* Errors */}
    <Route path="/403" element={<Forbidden />} />
    <Route path="/500" element={<ServerError />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
