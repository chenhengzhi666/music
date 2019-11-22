import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Recommend from '@/components/recommend'
import Ranking from '@/components/ranking'
import Singer from '@/components/singer'
import Search from '@/components/search'

const RouterMap = () => (
    <Switch>
        <Route path='/recommend' component={Recommend} />
        <Route exact path='/ranking' component={Ranking} />
        <Route exact path='/singer' component={Singer} />
        <Route exact path='/search' component={Search} />
        <Redirect to='/recommend' />
    </Switch>
)

export default RouterMap