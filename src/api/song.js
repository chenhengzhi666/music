import jsonp from "./jsonp"
import {URL, PARAM} from "./config"

const getSongVKey = (songMid) => (
    jsonp(
        URL.songVkey,
        {
            ...PARAM,
            g_tk: 1278911659,
            hostUin: 0,
            platform: "yqq",
            needNewCode: 0,
            cid: 205361747,
            uin: 0,
            songmid: songMid,
            filename: `C400${songMid}.m4a`,
            guid: 3655047200
        },
        {
            param: "callback",
            prefix: "callback"
        }
    )
)

export { getSongVKey }