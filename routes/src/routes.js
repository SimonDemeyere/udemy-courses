import UserComp from './Components/User'
import AboutComp from './Components/About/About_us';
import HomeComp from './Components/Home';
import AboutContentComp from './Components/About/About_content'

export const routes = [
    { path: '/user', component: UserComp, children: [
        { path: ':id', component: UserComp, name: 'userProfile' }
    ], beforeEnter: (to, from, next) => {
        console.log('before enter from routes')
        next()
    }},
    { path: '/about_us', component: AboutComp, children: [
        { path: 'show', component: AboutContentComp }
    ]},
    { path: '/', component: HomeComp, name: 'home' },
    { path: '*', component: HomeComp}
]