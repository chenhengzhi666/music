/**
 *  歌曲类模型
 */
class Song {
	constructor(id, mId, name, img, duration, url, singer) {
		this.id = id;
		this.mId = mId;
		this.name = name;
		this.img = img;
		this.duration = duration;
		this.url = url;
		this.singer = singer;
	}
}

/**
 *  创建歌曲对象函数
 */
const createSong = (data) => {
	return new Song(
		data.songid,
		data.songmid,
		data.songname,
		`http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
		data.interval,
		"",
		filterSinger(data.singer)
	);
}

const filterSinger = (singers) => {
	let singerArray = singers.map(singer => {
		return singer.name;
	});
	return singerArray.join("/");
}

export { Song, createSong }
