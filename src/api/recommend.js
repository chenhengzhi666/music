import jsonp from "./jsonp"
import { URL, PARAM, OPTION } from "./config"

const getCarousel = () => (
    jsonp(
        URL.carousel,
        {
            ...PARAM,
            g_tk: 701075963,
            uin: 0,
            platform: "h5",
            needNewCode: 1,
            _: new Date().getTime()
        },
        OPTION)
)

const getNewAlbum = () => (
    jsonp(
        URL.newalbum,
        {
            ...PARAM,
            g_tk: 1278911659,
            hostUin: 0,
            platform: "yqq",
            needNewCode: 0,
            data: `{"albumlib":
            {"method":"get_album_by_tags","param":
            {"area":1,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":50,"click_albumid":0},
            "module":"music.web_album_library"}}`
        },
        {
            param: "callback",
            prefix: "callback"
        }
    )
)

const getAlbumInfo = (albumMid) => (
    jsonp(
        URL.albumInfo,
        {
            ...PARAM,
            albummid: albumMid,
            g_tk: 1278911659,
            hostUin: 0,
            platform: "yqq",
            needNewCode: 0
        },
        OPTION
    )
)

export { getCarousel, getNewAlbum, getAlbumInfo }