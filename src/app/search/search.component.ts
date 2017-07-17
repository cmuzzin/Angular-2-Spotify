import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../shared/spotify/angular2-spotify';
import * as _ from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public searchQuery: string;
  public type: string;
  public returnedSearchData: any;
  public options: any;
  public hasQuery: boolean;
  public artists: any;
  public albums: any;
  public playlists: any;
  public tracks: any;

  constructor(public spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  search() {
    this.type = 'album,artist,track,playlist';
    if (!this.searchQuery) {
      this.hasQuery = false;
      return false;
    } else {
      this.hasQuery = true;
      this.spotifyService.search(this.searchQuery, this.type).subscribe(
        data => {
          this.returnedSearchData = data;
          console.log(this.returnedSearchData);
          this.artists = data.artists.items;
          this.albums = data.albums.items;
          this.playlists = data.playlists.items;
          this.tracks = data.tracks.items;
        },
        error => {
          console.log(error);
        }
      )
    }
  }
  loadMoreTracks() {
    this.options = {
      offset: 20
    };
    this.spotifyService.search(this.searchQuery, this.type, this.options).subscribe(
      data => {
        console.log(data);
      this.tracks = _.concat(this.tracks, data.tracks.items);
      },
      error => {
        console.log(error);
      }
    )
  }

}
