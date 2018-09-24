import { Component, OnInit } from '@angular/core';
import { ActiveSongService } from './active-song.service';
import { NavigationService } from '../../shared/services/navigation.service';
import {SpotifyService} from "../../shared/services/spotify-services";


@Component({
    selector: 'app-music-player',
    templateUrl: './music-player.component.html',
    styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {
    currentSong: any;

    constructor(private activeSongService: ActiveSongService,
                private spotifyService: SpotifyService,
                private navigationService: NavigationService) {
    }

    ngOnInit() {
        this.activeSongService.currentSong.subscribe(currentSong => {
            if (!currentSong.id) {
              return
            } else {
                this.getTrack(currentSong);
            }
        });
    }

    getTrack(currentSong) {
        this.spotifyService.getTrack(currentSong.id).subscribe(
            data => {
                this.currentSong = data;
            },
            error => {
                console.log(error);
            }
        );
    }


    goToArtist(artist) {
        this.navigationService.goToArtist(artist);
    }

}
