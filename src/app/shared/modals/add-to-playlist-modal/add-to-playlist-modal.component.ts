import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify-services';
import {AddSongToPlaylistService} from './add-song-to-playlist.service';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-to-playlist-modal',
  templateUrl: './add-to-playlist-modal.component.html',
  styleUrls: ['./add-to-playlist-modal.component.scss']
})
export class AddToPlaylistModalComponent implements OnInit {
  trackToAdd: any;
  user: any;
  totalPlaylists: any;
  playlists: Array<any>;
  options: any;
  toggle: boolean;

  constructor(private spotifyService: SpotifyService, private addSongToPlaylistService: AddSongToPlaylistService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.loadPlaylists();
    this.addSongToPlaylistService.songToAddToPlaylist.subscribe(
      songBeingAdded => {
        this.trackToAdd = songBeingAdded;
      }
    );
    this.addSongToPlaylistService.toggleAddSongToPlaylist.subscribe(
      toggle => {
        this.toggle = toggle;
      }
    );
  }

  closeAddToPlayListModal() {
    this.addSongToPlaylistService.toggleAddSongToPlaylist.next(false);
  };

  addToPlaylist(playlist) {
    if (playlist.owner.id === this.user.id) {
      this.spotifyService.addPlaylistTracks(playlist.owner.id, playlist.id, this.trackToAdd.uri).subscribe(
        () => {
          this.showSuccess(playlist, this.trackToAdd.name);
          this.closeAddToPlayListModal();
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.toastr.error('Invalid playlist');
      return false;
    }
  };

  loadPlaylists() {
    this.options = {
      limit: 50
    };
    this.spotifyService.getUserPlaylists(this.user.id, this.options).subscribe(
      data => {
        const playlists = [];
        _.each(data.items, p => {
          if (p.owner.id === this.user.id) {
            playlists.push(p);
          }
        });

        this.playlists = playlists;
        this.totalPlaylists = data.total;
      },
      error => {
        console.log(error);
      }
    )
  };

  showSuccess(playlist, track) {
    this.toastr.success(`${track} successfully added to playlist <span class="bold underline">${playlist.name} </span>`);
  };

}
