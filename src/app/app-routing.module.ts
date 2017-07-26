import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CallbackComponent} from "./callback/callback.component";
import {HomeComponent} from "./home/home.component";
import {SearchComponent} from "./search/search.component";
import {PlaylistsComponent} from "./playlists/playlists.component";
import {ProfileComponent} from "./profile/profile.component";
import {MainComponent} from "./main/main.component";
import {YourMusicComponent} from "./your-music/your-music.component";
import {SongsComponent} from "./songs/songs.component";
import {AlbumsComponent} from "./albums/albums.component";
import {ArtistsComponent} from "./artists/artists.component";
import {PlaylistComponent} from "./playlist/playlist.component";
import {AlbumComponent} from "./album/album.component";
import {BrowseComponent} from "./browse/browse.component";
import {FeaturedComponent} from "./featured/featured.component";
import {GenreMoodsComponent} from "./genre-moods/genre-moods.component";
import {NewReleasesComponent} from "./new-releases/new-releases.component";
import {AuthGuard} from "./shared/auth/auth.guard";
import {CategoryComponent} from "./category/category.component";
import {ArtistComponent} from "./artist/artist.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'your-music',
    component: YourMusicComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'search', pathMatch: 'full' },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'playlist',
        component: PlaylistComponent
      },
      {
        path: 'album',
        component: AlbumComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'artist',
        component: ArtistComponent
      },
      {
        path: 'your-music',
        component: YourMusicComponent,
        children: [
          { path: '', redirectTo: 'playlists', pathMatch: 'full' },
          {
            path: 'playlists',
            component: PlaylistsComponent
          },
          {
            path: 'songs',
            component: SongsComponent
          }
          ,
          {
            path: 'albums',
            component: AlbumsComponent
          },
          {
            path: 'artists',
            component: ArtistsComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'browse',
        component: BrowseComponent,
        children: [
          { path: '', redirectTo: 'featured', pathMatch: 'full' },
          {
            path: 'featured',
            component: FeaturedComponent
          },
          {
            path: 'genre-moods',
            component: GenreMoodsComponent
          }
          ,
          {
            path: 'new-releases',
            component: NewReleasesComponent
          }
        ]
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
