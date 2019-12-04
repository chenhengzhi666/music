import jsonp from './jsonp'
import { URL, PARAM, OPTION } from './config'

const getSingerList = (pageNum, key) => (
    jsonp(
        URL.singerList,
        {
            ...PARAM,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            platform: 'yqq',
            needNewCode: 0,
            channel: 'singer',
            page: 'list',
            key,
            pagenum: pageNum,
            pagesize: 100
        },
        OPTION
    )
)

const getSingerInfo = (mId) => (
    jsonp(
        URL.singerInfo,
        {
            ...PARAM,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            platform: 'yqq',
            needNewCode: 0,
            singermid: mId,
            order: 'listen',
            begin: 0,
            num: 100,
            songstatus: 1
        },
        OPTION
    )
)

export { getSingerList, getSingerInfo }