import {getRankingInfo} from './ranking'
import {getAlbumInfo} from './recommend'

const getDetailInfo = (type, id) => {
    switch(type) {
        case 'ranking':
            return getRankingInfo(id)
        case 'recommend':
            return getAlbumInfo(id)
        default:
            return {}
    }
} 

export default getDetailInfo