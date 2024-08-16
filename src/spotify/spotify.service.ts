// import { Injectable } from "@nestjs/common";
// import SpotifyWebApi from "spotify-web-api-node";

// @Injectable()
// export class SpotifyService {
//     private spotifyApi: SpotifyWebApi;

//     constructor() {
//         this.spotifyApi = new SpotifyWebApi({
//             clientId: process.env.SPOTIFY_CLIENT_ID,
//             clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//         });
//     }


//     async getTrack(title: string): Promise<string> {
//         try {
//             const data = await this.spotifyApi.clientCre
//         } catch (error) {
//             throw new Error(`Error retrieving track: ${error.message}`)
//         }
//     }
// }