import {Injectable} from '@angular/core';
import {Http, Headers, Response, Request} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SafeResourceUrl} from '@angular/platform-browser';

export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  authToken?: string;
  apiBase: string;
}

export interface SpotifyOptions {
  limit?: number;
  offset?: number;
  market?: string;
  album_type?: string;
  country?: string;
  type?: string;
  q?: string;
  timestamp?: string;
  locale?: string;
  public?: boolean;
  name?: string;
}

interface HttpRequestOptions {
  method?: string;
  url: string;
  search?: Object;
  body?: Object;
  headers?: Headers;
}

@Injectable()
export class SpotifyService {
  public clientId: string;
  public redirectUri: string;
  public scope: string;
  public showDialog: boolean;
  public authToken: string;
  public apiBase: string;
  public userInfo: any;
  public playListInfo: any;
  public playerUrl: SafeResourceUrl;

  constructor(private http: Http) {
    this.clientId = '9d7ee30778da43ce8b048be43fb84050';
    this.redirectUri = 'http://' + window.location.host + '/callback';
    this.scope = 'user-follow-modify user-follow-read playlist-read-private playlist-read-collaborative playlist-modify-public ' +
      'playlist-modify-private user-library-read user-library-modify user-read-private user-read-playback-state user-modify-playback-state';
    this.showDialog = true;
    this.authToken = localStorage.getItem('angular2-spotify-token');
    this.apiBase = 'https://api.spotify.com/v1';
  }

  //#region albums

  /**
   * Gets an album
   * Pass in album id or spotify uri
   */
  getAlbum(album: string) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  /**
   * Gets albums
   * Pass in comma separated string or array of album ids
   */
  getAlbums(albums: string | Array<string>) {
    let albumList = this.mountItemList(albums);
    return this.api({
      method: 'get',
      url: `/albums`,
      search: {ids: albumList.toString()}
    }).map(res => res.json());
  }

  /**
   * Get Album Tracks
   * Pass in album id or spotify uri
   */
  getAlbumTracks(album: string, options?: SpotifyOptions) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}/tracks`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region artists

  /**
   * Get an Artist
   */
  getArtist(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  /**
   * Get multiple artists
   */
  getArtists(artists: string | Array<string>) {
    let artistList = this.mountItemList(artists);
    return this.api({
      method: 'get',
      url: `/artists/`,
      search: {ids: artists.toString()}
    }).map(res => res.json());
  }

  getFollowedArtists(type: string, options?: SpotifyOptions) {
    options = options || {};
    options.type = type;
    return this.api({
      method: 'get',
      url: `/me/following`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //Artist Albums
  getArtistAlbums(artist: string, options?: SpotifyOptions) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/albums`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  /**
   * Get Artist Top Tracks
   * The country: an ISO 3166-1 alpha-2 country code.
   */
  getArtistTopTracks(artist: string, country: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/top-tracks`,
      search: {country: country},
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getRelatedArtists(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/related-artists`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }


  //#endregion

  //#region browse

  getFeaturedPlaylists(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/featured-playlists`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getNewReleases(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/new-releases`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategories(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategory(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategoryPlaylists(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}/playlists`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region following

  following(type: string, options?: SpotifyOptions) {
    options = options || {};
    options.type = type;
    return this.api({
      method: 'get',
      url: `/me/following`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  follow(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'put',
      url: `/me/following`,
      search: {type: type, ids: ids.toString()},
      headers: this.getHeaders()
    });
  }

  unfollow(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'delete',
      url: `/me/following`,
      search: {type: type, ids: ids.toString()},
      headers: this.getHeaders()
    });
  }

  userFollowingContains(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/me/following/contains`,
      search: {type: type, ids: ids.toString()},
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  followPlaylist(userId: string, playlistId: string, isPublic?: boolean) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      body: {public: !!isPublic},
      headers: this.getHeaders(true)
    });
  }

  unfollowPlaylist(userId: string, playlistId: string) {
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      headers: this.getHeaders()
    });
  }

  playlistFollowingContains(userId: string, playlistId: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/followers/contains`,
      search: {ids: ids.toString()},
      headers: this.getHeaders()
    }).map(res => res.json());
  }


  //#endregion

  //#region library

  getUserTopArtistsAndTracks(type: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/top/${type}`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  getSavedUserTracks(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  userTracksContains(tracks: string | Array<string>) {
    let trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/me/tracks/contains`,
      headers: this.getHeaders(),
      search: {ids: trackList.toString()}
    }).map(res => res.json());
  }

  saveUserTracks(tracks: string | Array<string>) {
    let trackList = this.mountItemList(tracks);

    return this.api({
      method: 'put',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: {ids: trackList.toString()}
    });
  }

  removeUserTracks(tracks: string | Array<string>) {
    let trackList = this.mountItemList(tracks);

    return this.api({
      method: 'delete',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: {ids: trackList.toString()}
    });
  }

  getSavedUserAlbums(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  saveUserAlbums(albums: string | Array<string>) {
    let albumList = this.mountItemList(albums);

    return this.api({
      method: 'put',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: {ids: albumList.toString()}
    });
  }

  removeUserAlbums(albums: string | Array<string>) {
    let albumList = this.mountItemList(albums);

    return this.api({
      method: 'delete',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: {ids: albumList.toString()}
    });
  }

  userAlbumsContains(albums: string | Array<string>) {
    let albumList = this.mountItemList(albums);

    return this.api({
      method: 'get',
      url: `/me/albums/contains`,
      headers: this.getHeaders(),
      search: {ids: albumList.toString()}
    }).map(res => res.json());
  }

  //#endregion

  //#region playlists

  public getCurrentUsersPlaylists(limit: number, offSet: number) {
    return this.api({
      method: 'get',
      url: `/me/playlists?limit=${limit}&offset=${offSet}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getUserPlaylists(userId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  getPlaylist(userId: string, playlistId: string, options?: {fields: string}) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  getPlaylistTracks(userId: string, playlistId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  createPlaylist(userId: string, options: {name: string, public?: boolean}) {
    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(true),
      body: options
    }).map(res => res.json());
  }

  addPlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>, options?: {position: number}) {
    let trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    let search = {uris: trackList.toString()};
    if (!!options) search['position'] = options.position;

    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      search: search
    }).map(res => res.json());
  }

  removePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    let trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    let trackUris = [];
    trackList.forEach((value, index) => {
      trackUris[index] = {
        uri: value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value
      };
    });
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: {tracks: trackUris}
    }).map(res => res.json());
  }

  reorderPlaylistTracks(userId: string, playlistId: string, options: {range_start: number, range_length?: number, insert_before: number, snapshot_id?: string}) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: options
    }).map(res => res.json());
  }

  replacePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    let trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: {uris: trackList.toString()}
    }).map(res => res.json());
  }

  updatePlaylistDetails(userId: string, playlistId: string, options: Object) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(true),
      body: options
    });
  }

  //#endregion

  //#region profiles

  getUser(userId: string) {
    return this.api({
      method: 'get',
      url: `/users/${userId}`
    }).map(res => res.json());
  }

  getCurrentUser() {
    return this.api({
      method: 'get',
      url: `/me`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region search

  /**
   * Search Spotify
   * q = search query
   * type = artist, album or track
   */
  search(q: string, type: string, options?: SpotifyOptions) {
    options = options || {};
    options.q = q;
    options.type = type;

    return this.api({
      method: 'get',
      url: `/search`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region tracks

  getTrack(track: string) {
    track = this.getIdFromUri(track);
    return this.api({
      method: 'get',
      url: `/tracks/${track}`
    }).map(res => res.json());
  }

  getTracks(tracks: string | Array<string>) {
    let trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/tracks/`,
      search: {ids: trackList.toString()}
    }).map(res => res.json());
  }

  //#endregion


  //$region play
  getUserDevices() {
    return this.api({
      method: 'get',
      url: `/me/player/devices/`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  startResumePlayer(options: Object) {
    return this.api({
      method: 'put',
      url: `/me/player/play/`,
      headers: this.getHeaders(),
      body: options
    }).map(res => res.json());
  }


  //# end region


  //#region login

  login() {
    let promise = new Promise((resolve, reject) => {
      let w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      let params = {
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: this.scope || '',
        response_type: 'token',
        show_dialog: this.showDialog
      };
      let authCompleted = false;
      let authWindow = this.openDialog(
        'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );

      let storageChanged = (e) => {
        if (e.key === 'angular2-spotify-token') {
          if (authWindow) {
            authWindow.close();
          }
          authCompleted = true;

          this.authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    return Observable.fromPromise(promise).catch(this.handleError);
  }

  //#endregion

  //#region utils

  private toQueryString(obj: Object): string {
    let parts = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    ;
    return parts.join('&');
  };

  private openDialog(uri, name, options, cb) {
    let win = window.open(uri, name, options);
    let interval = window.setInterval(() => {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) {
        console.log(e);
      }
    }, 100000000);
    return win;
  }

  private auth(isJson?: boolean): Object {
    let auth = {
      'Authorization': 'Bearer ' + this.authToken
    };
    if (isJson) {
      auth['Content-Type'] = 'application/json';
    }
    return auth;
  }

  private getHeaders(isJson?: boolean): any {
    return new Headers(this.auth(isJson));
  }

  private getIdFromUri(uri: string) {
    return uri.indexOf('spotify:') === -1 ? uri : uri.split(':')[2];
  }

  private mountItemList(items: string | Array<string>): Array<string> {
    let itemList = Array.isArray(items) ? items : items.split(',');
    itemList.forEach((value, index) => {
      itemList[index] = this.getIdFromUri(value);
    });
    return itemList;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  private api(requestOptions: HttpRequestOptions) {
    return this.http.request(new Request({
      url: this.apiBase + requestOptions.url,
      method: requestOptions.method || 'get',
      search: this.toQueryString(requestOptions.search),
      body: JSON.stringify(requestOptions.body),
      headers: requestOptions.headers
    }));
  }

  //#endregion
}
