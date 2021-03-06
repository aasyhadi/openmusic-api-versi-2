class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    // POST Handler
    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const songId = await this._service.addSong(request.payload);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan.',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    // GET Handler
    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
        };
    }

    // GET-Id Handler
    async getSongByIdHandler(request) {
        const { songId } = request.params;
        const song = await this._service.getSongById(songId);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    // PUT-Id Handler
    async putSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const {
            title, year, performer, genre, duration,
        } = request.payload;
        const { songId } = request.params;

        await this._service.editSongById(songId, {
            title,
            year,
            performer,
            genre,
            duration,
        });

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui.',
        };
    }

    // DELETE-Id Handler
    async deleteSongByIdHandler(request) {
        const { songId } = request.params;
        await this._service.deleteSongById(songId);
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus.',
        };
    }
}
module.exports = SongsHandler;
