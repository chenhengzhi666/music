import * as SongModel from './song'

class Ranking {
    constructor(id, title, img, songs, desc) {
        this.id = id;
        this.title = title;
        this.img = img;
        this.songs = songs;
        this.desc = desc;
    }
}

const createRankingByList = (data) => {
    return new Ranking(
        data.id,
        data.topTitle,
        data.picUrl,
        data.songList.map(item => (
            new SongModel.Song(0, '', item.songname, '', 0, '', item.singername)
        )),
        ''
    )
}

const createRankingByDetail = (data) => {
    return new Ranking (
        data.topID,
        data.ListName,
        `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.pic_album.match(/T002R300x300M000(\S*)\./)[1]}.jpg?max_age=2592000`,
        [],
        data.info
    )
}

export { Ranking, createRankingByList, createRankingByDetail }