import {Component, OnInit} from '@angular/core';
import {SpotifyService} from "../shared/spotify/angular2-spotify";
import * as moment from 'moment';
import * as _ from "lodash";
import {Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public artist: any;
  public user: any;
  public topTracks: any;
  public options: any;
  public artistAlbums: any;
  public singles: any;
  public compilations: any;
  public album: any;

  constructor(public spotifyService: SpotifyService, public router: Router) {
  }

  ngOnInit() {
    this.loadTopTracks();
    this.loadArtistAlbums();
    this.loadArtistSingles();
    this.loadCompliations();
  }

  loadTopTracks() {
    this.artist = JSON.parse(localStorage.getItem('artist'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.spotifyService.getArtistTopTracks(this.artist.id, this.user.country).subscribe(
      data => {
        console.log(data);
        this.topTracks = data.tracks;
        _.each(this.topTracks, track => {
          track.duration_ms = moment(track.duration_ms).format('m:ss');
        })
      },
      error => {
        console.log(error);
      }
    )
  }

  loadArtistAlbums() {
    this.options = {
      album_type: 'album',
      limit: 50
    };
    this.spotifyService.getArtistAlbums(this.artist.id, this.options).subscribe(
      data => {
        this.artistAlbums = data.items;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadArtistSingles() {
    this.options = {
      album_type: 'single',
      limit: 50
    };
    this.spotifyService.getArtistAlbums(this.artist.id, this.options).subscribe(
      data => {
        this.singles = data.items;
      },
      error => {
        console.log(error);
      }
    )
  };

  loadCompliations() {
    this.options = {
      album_type: 'compilation',
      limit: 50
    };
    this.spotifyService.getArtistAlbums(this.artist.id, this.options).subscribe(
      data => {
        this.compilations = data.items;
      },
      error => {
        console.log(error);
      }
    )
  };

  goToAlbum(album) {
     this.spotifyService.getAlbum(album.id).subscribe(
       data => {
         this.album = {
           album: data
         };
         localStorage.setItem('album', JSON.stringify(this.album));
         this.router.navigate(['main/album']);
       },
       error => {
         console.log(error);
       }
     );
  }


}
