import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Recommend from '@/components/recommend'
import Ranking from '@/components/ranking'
import Singer from '@/components/singer'
import Search from '@/containers/Search'

const RouterMap = () => (
    <Switch>
        {/* 精准匹配需要exact */}
        <Route path='/recommend' component={Recommend} />
        <Route path='/ranking' component={Ranking} />
        <Route path='/singer' component={Singer} />
        <Route path='/search' component={Search} />
        <Redirect to='/recommend' />
    </Switch>
)

export default RouterMap