// apps/mobile/src/styles/index.ts

//Theme tokens
export * from './theme/colors'
export * from './theme/spacing'
export * from './theme/typography'

//Auth components 
export * from './components/auth/authComponents.styles'

//Landing components
export {
  GoogleBtnStyles,
  HeroStyles,
  LoginPromptStyles,
  RegisterBtnStyles,
} from './components/landing/landingComponents.styles'

//Dashboard components 
export * from './components/dashboard/dashboardComponents.styles'
export { createDashboardTabsStyles } from './components/dashboard/DashboardTabs.styles'
export { createBottomNavStyles }       from './components/header/BottomNav.styles'
export { MobileHeaderStyles } from './components/header/MobileHeader.styles'

//Screen styles 
export { LandingPageStyles }   from './screens/LandingPage.styles'
export { LoginPageStyles }     from './screens/LoginPage.styles'
export { RegisterPageStyles }  from './screens/RegisterPage.styles'
export { DashboardMainStyles } from './screens/DashboardMain.styles'

//Layout styles
export { PlainLayoutStyles }     from './layouts/PlainLayout.styles'
export { AuthLayoutStyles }      from './layouts/AuthLayout.styles'
export { DashboardLayoutStyles } from './layouts/DashboardLayout.styles'
