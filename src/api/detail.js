import { getRankingInfo } from './ranking'
import { getAlbumInfo } from './recommend'
import { getSingerInfo } from './singer'

const getDetailInfo = (type, id) => {
    switch (type) {
        case 'ranking':
            return getRankingInfo(id)
        case 'recommend':
            return getAlbumInfo(id)
        case 'singer':
            return getSingerInfo(id)
        default:
            return {}
    }
}

export default getDetailInfo