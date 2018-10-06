import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {YourMusicComponent} from "./your-music.component";
import {AlbumsComponent} from "./albums/albums.component";
import {AlbumComponent} from "./albums/album/album.component";
import {ArtistsComponent} from "./artists/artists.component";
import {ArtistComponent} from "./artists/artist/artist.component";
import {PlaylistsComponent} from "./playlists/playlists.component";
import {PlaylistComponent} from "./playlists/playlist/playlist.component";
import {UserComponent} from "./playlists/user/user.component";
import {SongsComponent} from "./songs/songs.component";
import {RelatedArtistsComponent} from "./artists/artist/related-artists/related-artists.component";
import {OverviewComponent} from "./artists/artist/overview/overview.component";
import { MostPlayedComponent } from './most-played/most-played.component';
import {AppRoutingModule} from "../../app-routing.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    YourMusicComponent,
    AlbumsComponent,
    AlbumComponent,
    ArtistsComponent,
    ArtistComponent,
    RelatedArtistsComponent,
    OverviewComponent,
    PlaylistsComponent,
    PlaylistComponent,
    UserComponent,
    SongsComponent,
    MostPlayedComponent
  ]
})
export class YourMusicModule { }
