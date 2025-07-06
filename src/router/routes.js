import * as path from "path";

const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {path: '', name: 'home', component: () => import('pages/IndexPage.vue')}
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {path: 'admin', name: 'login-admin', component: () => import('pages/auth/AdminPage.vue')},
      {path: 'company', name: 'login-company', component: () => import('pages/auth/CompanyPage.vue')},
      {path: 'group', name: 'login-group', component: () => import('pages/auth/GroupPage.vue')},
      {path: 'client', name: 'login-client', component: () => import('pages/auth/ClientPage.vue')}
    ]
  },
  {
    path: '/companies',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', name: "companies", component: () => import('pages/company/CompaniesPage.vue')},
      {
        path: 'new',
        name: 'new-company',
        meta: {
          permissions: ['admin'],
          roles: ['admin']
        },
        component: () => import('pages/company/NewCompany.vue')
      },
      {path: 'edit/:id?', name: 'edit-company', component: () => import('pages/company/EditCompany.vue')}
    ]
  },
  {
    path: '/groups',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', name: "groups", component: () => import('pages/group/GroupsPage.vue')},
      {
        path: 'new',
        name: 'new-group',
        meta: {
          permissions: ['admin'],
          roles: ['admin']
        },
        component: () => import('pages/group/NewGroup.vue')
      },
      {path: 'edit/:id?', name: 'edit-group', component: () => import('pages/group/EditGroup.vue')},
      {path: ':group_id/facilities', name: 'group-facility', component: ()  => import('pages/group/GroupFacilityPage.vue')},
      {path: ':group_id/facilities/:id', name: 'group-facility-edit', component: ()  => import('pages/group/GroupFacilityEditPage.vue')}
    ]
  },
  {
    path: '/facility',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':company_id', name: 'facility', component: () => import('pages/facility/ListPage.vue')},
      {path: ':company_id/edit/:id', name: 'edit-facility', component: () => import('pages/facility/EditPage.vue')},
      {path: ':company_id/new', name: 'new-facility', component: () => import('pages/facility/NewPage.vue')}
    ]
  },
  {
    path: '/logs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':facility_id/:ctx', name: 'log-index', component: () => import('pages/logs/indexPage.vue')},
      {path: ':facility_id/:ctx/:work_id/:date', name: 'log-view', component: () => import('pages/logs/viewPage.vue')},
    ]
  },
  {
    path: '/drugs',
    component:() =>import('layouts/MainLayout.vue'),
    children: [
      {path: '', name: 'drugs-index', component:()=>import('pages/drug/Index.vue')},
      {path: '', name: 'drugs-new', component:()=>import('pages/drug/New.vue')},
      {path: ':drug_id', name: 'drugs-update', component:()=>import('pages/drug/Update.vue')},
    ]
  },
  {
    path: '/drugs',
    component:() =>import('layouts/MainLayout.vue'),
    children: [
      {path: '', name: 'drugs-index', component:()=>import('pages/drug/Index.vue')},
      {path: '', name: 'drugs-new', component:()=>import('pages/drug/New.vue')},
      {path: ':drug_id', name: 'drugs-update', component:()=>import('pages/drug/Update.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
