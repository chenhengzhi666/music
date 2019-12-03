import jsonp from './jsonp'
import { URL, PARAM, OPTION } from './config'

const getRankingList = () => (
    jsonp(
        URL.rankingList,
        {
            ...PARAM,
            g_tk: 5381,
            uin: 0,
            platform: "h5",
            needNewCode: 1,
            _: new Date().getTime()
        },
        OPTION
    )
)

const getRankingInfo = (topId) => (
    jsonp(
        URL.rankingInfo,
        {
            ...PARAM,
            g_tk: 5381,
            uin: 0,
            platform: "h5",
            needNewCode: 1,
            tpl: 3,
            page: "detail",
            type: "top",
            topid: topId,
            _: new Date().getTime()
        },
        OPTION
    )
)

export { getRankingInfo, getRankingList }