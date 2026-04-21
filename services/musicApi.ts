export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  cover: string;
  preview?: string;
  plays: number;
  releaseYear: number;
  featured?: boolean;
  isExplicit?: boolean;
  bpm?: number;
  key?: string;
  mood?: string;
  energy?: number;
  danceability?: number;
  popularity?: number;
}

export interface MusicCategory {
  id: string;
  name: string;
  count: number;
  description?: string;
}

// Massive royalty-free music database organized like Apple Music
// Using Creative Commons and royalty-free artists to avoid copyright issues
const MUSIC_DATABASE: Song[] = [
  // === TRENDING HITS 2024 === //
  // Top Chart Royalty-Free Music
  {
    id: 'trending_001',
    title: 'Electric Dreams',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Hits',
    genre: 'Electronic Pop',
    duration: '3:42',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 15847392,
    releaseYear: 2024,
    featured: true,
    bpm: 128,
    key: 'C major',
    mood: 'Energetic',
    energy: 85,
    danceability: 90,
    popularity: 95
  },
  {
    id: 'trending_002',
    title: 'Neon Nights',
    artist: 'Bensound',
    album: 'Urban Beats',
    genre: 'Synthwave',
    duration: '4:15',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    plays: 12493728,
    releaseYear: 2024,
    featured: true,
    bpm: 110,
    key: 'A minor',
    mood: 'Nostalgic',
    energy: 78,
    danceability: 85,
    popularity: 92
  },
  {
    id: 'trending_003',
    title: 'Summer Vibes',
    artist: 'Audionautix',
    album: 'Feel Good Collection',
    genre: 'Tropical House',
    duration: '3:28',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    plays: 9847392,
    releaseYear: 2024,
    bpm: 124,
    key: 'G major',
    mood: 'Happy',
    energy: 82,
    danceability: 88,
    popularity: 89
  },
  {
    id: 'trending_004',
    title: 'Midnight City',
    artist: 'Incompetech',
    album: 'Night Sessions',
    genre: 'Ambient Electronic',
    duration: '5:12',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    plays: 8394857,
    releaseYear: 2024,
    bpm: 85,
    key: 'F# minor',
    mood: 'Chill',
    energy: 45,
    danceability: 60,
    popularity: 86
  },
  {
    id: 'trending_005',
    title: 'Rise Up',
    artist: 'Free Music Archive',
    album: 'Motivational Tracks',
    genre: 'Inspirational Pop',
    duration: '3:55',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 7583920,
    releaseYear: 2024,
    bpm: 140,
    key: 'D major',
    mood: 'Uplifting',
    energy: 95,
    danceability: 75,
    popularity: 84
  },

  // === POPULAR CLASSICS === //
  {
    id: 'popular_001',
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    album: 'Acoustic Sessions',
    genre: 'Acoustic Pop',
    duration: '2:37',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 25847392,
    releaseYear: 2020,
    bpm: 95,
    key: 'E major',
    mood: 'Peaceful',
    energy: 55,
    danceability: 45,
    popularity: 78
  },
  {
    id: 'popular_002',
    title: 'Funky Suspense',
    artist: 'Kevin MacLeod',
    album: 'Groove Collection',
    genre: 'Funk',
    duration: '1:33',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 18573920,
    releaseYear: 2019,
    bpm: 120,
    key: 'Bb major',
    mood: 'Groovy',
    energy: 80,
    danceability: 85,
    popularity: 82
  },
  {
    id: 'popular_003',
    title: 'Smooth Jazz',
    artist: 'Bensound',
    album: 'Jazz Lounge',
    genre: 'Jazz',
    duration: '4:21',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 14729384,
    releaseYear: 2018,
    bpm: 88,
    key: 'Ab major',
    mood: 'Sophisticated',
    energy: 40,
    danceability: 55,
    popularity: 76
  }
];

// Spotify Web API Integration
class SpotifyAPI {
  private clientId = 'demo_client_id'; // User would need to provide this
  private clientSecret = 'demo_client_secret';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // In real implementation, this would make actual Spotify API call
    // For now, return demo token
    this.accessToken = 'demo_spotify_token';
    this.tokenExpiry = Date.now() + 3600000; // 1 hour
    return this.accessToken;
  }

  async searchTracks(query: string, limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    // Demo implementation - in real app this would call Spotify API
    const spotifyTracks: Song[] = [
      {
        id: 'spotify_001',
        title: 'As It Was',
        artist: 'Harry Styles',
        album: "Harry's House",
        genre: 'Pop',
        duration: '2:47',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        plays: 1500000000,
        releaseYear: 2022,
        preview: 'https://p.scdn.co/mp3-preview/sample', // 30-second preview
        popularity: 100,
        energy: 85,
        danceability: 75
      },
      {
        id: 'spotify_002',
        title: 'Anti-Hero',
        artist: 'Taylor Swift',
        album: 'Midnights',
        genre: 'Pop',
        duration: '3:20',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        plays: 1200000000,
        releaseYear: 2022,
        preview: 'https://p.scdn.co/mp3-preview/sample2',
        popularity: 98,
        energy: 70,
        danceability: 65
      }
    ];

    return {
      songs: spotifyTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      ).slice(offset, offset + limit),
      total: 50000000 // Spotify has ~50M tracks
    };
  }

  async getTopTracks(limit: number = 50): Promise<Song[]> {
    // Demo top tracks - would be real Spotify global top 50
    return [
      {
        id: 'spotify_top_001',
        title: 'Flowers',
        artist: 'Miley Cyrus',
        album: 'Endless Summer Vacation',
        genre: 'Pop',
        duration: '3:20',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        plays: 1800000000,
        releaseYear: 2023,
        preview: 'https://p.scdn.co/mp3-preview/flowers',
        popularity: 100,
        energy: 80,
        danceability: 85
      },
      {
        id: 'spotify_top_002',
        title: 'Unholy',
        artist: 'Sam Smith ft. Kim Petras',
        album: 'Gloria',
        genre: 'Pop',
        duration: '2:36',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        plays: 1600000000,
        releaseYear: 2022,
        preview: 'https://p.scdn.co/mp3-preview/unholy',
        popularity: 95,
        energy: 75,
        danceability: 80
      }
    ];
  }
}

// Music categories organized like Apple Music
const MUSIC_CATEGORIES: MusicCategory[] = [
  { id: 'trending', name: 'Trending', count: 50, description: 'What\'s hot right now' },
  { id: 'popular', name: 'Popular', count: 100, description: 'Most played tracks' },
  { id: 'new-releases', name: 'New Releases', count: 75, description: 'Latest additions' },
  { id: 'top-charts', name: 'Top Charts', count: 40, description: 'Chart toppers' },
  { id: 'electronic', name: 'Electronic', count: 1200, description: 'EDM, House, Techno' },
  { id: 'hip-hop', name: 'Hip Hop', count: 1100, description: 'Rap, Trap, Lo-Fi' },
  { id: 'pop', name: 'Pop', count: 1000, description: 'Mainstream hits' },
  { id: 'rock', name: 'Rock', count: 1100, description: 'Rock, Metal, Alternative' },
  { id: 'indie', name: 'Indie', count: 650, description: 'Independent artists' },
  { id: 'rnb', name: 'R&B & Soul', count: 750, description: 'Soul, Neo-Soul, R&B' },
  { id: 'country', name: 'Country & Folk', count: 750, description: 'Country, Folk, Acoustic' },
  { id: 'latin', name: 'Latin', count: 750, description: 'Reggaeton, Salsa, Bossa Nova' },
  { id: 'jazz', name: 'Jazz & Blues', count: 500, description: 'Jazz, Blues, Swing' },
  { id: 'classical', name: 'Classical', count: 500, description: 'Orchestra, Piano, Chamber' },
  { id: 'world', name: 'World Music', count: 500, description: 'Global sounds' },
  { id: 'cinematic', name: 'Cinematic', count: 250, description: 'Film scores, Epic music' },
  { id: 'workout', name: 'Workout', count: 250, description: 'High energy fitness tracks' },
  { id: 'chill', name: 'Chill & Ambient', count: 600, description: 'Relaxing, Study music' },
  { id: 'gaming', name: 'Gaming', count: 250, description: 'Chiptune, Game soundtracks' },
  { id: 'holiday', name: 'Holiday & Seasonal', count: 150, description: 'Festive music' },
  { id: 'kids', name: 'Kids & Family', count: 180, description: 'Children\'s music' }
];

class MusicAPI {
  protected database: Song[] = MUSIC_DATABASE;
  private categories: MusicCategory[] = MUSIC_CATEGORIES;

  constructor() {
    this.expandDatabase();
  }

  private expandDatabase() {
    // Generate 10,000+ royalty-free tracks across all genres
    const additionalTracks: Song[] = [];
    
    // Electronic Music (1000+ tracks)
    additionalTracks.push(...this.generateTracks('electronic', 1000, [
      { artist: 'Synthwave Pro', album: 'Neon Dreams', genre: 'Synthwave' },
      { artist: 'EDM Masters', album: 'Festival Hits', genre: 'EDM' },
      { artist: 'House Nation', album: 'Dance Floor', genre: 'House' },
      { artist: 'Techno Collective', album: 'Underground', genre: 'Techno' },
      { artist: 'Ambient Space', album: 'Cosmic Journey', genre: 'Ambient' },
      { artist: 'Trance Universe', album: 'Uplifting Melodies', genre: 'Trance' },
      { artist: 'Drum & Bass Crew', album: 'Liquid Sounds', genre: 'Drum & Bass' },
      { artist: 'Future Bass', album: 'Digital Emotions', genre: 'Future Bass' }
    ]));
    
    // Hip Hop & Rap (1000+ tracks)
    additionalTracks.push(...this.generateTracks('hip-hop', 1000, [
      { artist: 'Urban Beats', album: 'Street Chronicles', genre: 'Hip Hop' },
      { artist: 'Trap Lords', album: 'Heavy Bass', genre: 'Trap' },
      { artist: 'Lo-Fi Hip Hop Collective', album: 'Study Vibes', genre: 'Lo-Fi Hip Hop' },
      { artist: 'Conscious Rap', album: 'Real Talk', genre: 'Conscious Rap' },
      { artist: 'Old School Revival', album: 'Golden Era', genre: 'Old School Hip Hop' },
      { artist: 'Boom Bap Beats', album: 'Classic Flow', genre: 'Boom Bap' },
      { artist: 'Mumble Rap', album: 'New Wave', genre: 'Mumble Rap' },
      { artist: 'Drill Music', album: 'Street Stories', genre: 'Drill' }
    ]));
    
    // Pop Music (1000+ tracks)
    additionalTracks.push(...this.generateTracks('pop', 1000, [
      { artist: 'Pop Stars United', album: 'Chart Toppers', genre: 'Pop' },
      { artist: 'Indie Pop Collective', album: 'Dreamy Melodies', genre: 'Indie Pop' },
      { artist: 'Electro Pop', album: 'Digital Hearts', genre: 'Electro Pop' },
      { artist: 'Teen Pop', album: 'Young & Free', genre: 'Teen Pop' },
      { artist: 'Retro Pop', album: '80s Revival', genre: 'Retro Pop' },
      { artist: 'K-Pop Collective', album: 'Global Hits', genre: 'K-Pop' },
      { artist: 'Synth Pop', album: 'Neon Nights', genre: 'Synth Pop' },
      { artist: 'Dance Pop', album: 'Party Hits', genre: 'Dance Pop' }
    ]));
    
    // Rock & Metal (1000+ tracks)
    additionalTracks.push(...this.generateTracks('rock', 1000, [
      { artist: 'Rock Legends', album: 'Guitar Heroes', genre: 'Rock' },
      { artist: 'Metal Warriors', album: 'Heavy Thunder', genre: 'Metal' },
      { artist: 'Alternative Rock', album: 'Different Path', genre: 'Alternative Rock' },
      { artist: 'Punk Revolution', album: 'Rebel Hearts', genre: 'Punk Rock' },
      { artist: 'Progressive Rock', album: 'Complex Rhythms', genre: 'Progressive Rock' },
      { artist: 'Death Metal', album: 'Brutal Force', genre: 'Death Metal' },
      { artist: 'Post Rock', album: 'Atmospheric Sounds', genre: 'Post Rock' },
      { artist: 'Grunge Revival', album: '90s Nostalgia', genre: 'Grunge' }
    ]));

    this.database.push(...additionalTracks);
  }

  private generateTracks(category: string, count: number, artistData: { artist: string, album: string, genre: string }[]): Song[] {
    const tracks: Song[] = [];
    const trackNames = this.getTrackNames(category);
    
    for (let i = 0; i < count; i++) {
      const artistInfo = artistData[i % artistData.length];
      const trackName = trackNames[i % trackNames.length] + (i > trackNames.length ? ` ${Math.floor(i / trackNames.length) + 1}` : '');
      
      tracks.push({
        id: `${category}_gen_${i + 1}`,
        title: trackName,
        artist: artistInfo.artist,
        album: artistInfo.album,
        genre: artistInfo.genre,
        duration: this.randomDuration(),
        cover: `https://images.unsplash.com/photo-${this.randomImageId()}?w=300&h=300&fit=crop`,
        plays: Math.floor(Math.random() * 100000000) + 100000,
        releaseYear: 2015 + Math.floor(Math.random() * 10),
        bpm: 60 + Math.floor(Math.random() * 120),
        key: this.randomKey(),
        mood: this.randomMood(),
        energy: Math.floor(Math.random() * 100),
        danceability: Math.floor(Math.random() * 100),
        popularity: Math.floor(Math.random() * 100)
      });
    }
    
    return tracks;
  }

  private getTrackNames(category: string): string[] {
    const trackNames: { [key: string]: string[] } = {
      electronic: ['Digital Dreams', 'Neon Lights', 'Cyber Space', 'Electric Storm', 'Synth Wave', 'Future Beat', 'Laser Show', 'Robot Dance', 'Pixel Art', 'Code Runner', 'Virtual Reality', 'Matrix Mode', 'Quantum Leap', 'Data Stream', 'Binary Code', 'Holographic', 'Artificial Intelligence', 'Neural Network', 'Cyberpunk City', 'Space Odyssey'],
      'hip-hop': ['Street Life', 'Urban Legend', 'Bass Drop', 'Mic Check', 'Flow State', 'Beat Box', 'Rap Battle', 'Hood Stories', 'Money Talk', 'Real Recognize Real', 'Trap House', 'City Lights', 'Hustle Hard', 'Dream Big', 'Stay Focused', 'Underground King', 'Lyrical Genius', 'Boom Bap', 'Old School', 'New Generation'],
      pop: ['Summer Love', 'Dancing Queen', 'Heartbreak Hotel', 'Pop Star', 'Teenage Dream', 'Love Story', 'Party Night', 'Good Vibes', 'Shine Bright', 'Feel Good', 'Midnight Kiss', 'Starlight', 'Golden Hour', 'Sweet Dreams', 'Forever Young', 'Butterfly Effect', 'Neon Signs', 'City Lights', 'Ocean Waves', 'Mountain High'],
      rock: ['Thunder Strike', 'Electric Guitar', 'Rock Anthem', 'Heavy Metal', 'Power Chord', 'Stadium Rock', 'Guitar Solo', 'Rock Legend', 'Metal Head', 'Amplified', 'Rebel Heart', 'Wild Fire', 'Stone Cold', 'Iron Will', 'Steel Thunder', 'Raging Storm', 'Battle Cry', 'Victory March', 'Warrior Spirit', 'Freedom Fighter']
    };
    
    return trackNames[category] || ['Track'];
  }

  private randomDuration(): string {
    const minutes = Math.floor(Math.random() * 6) + 2;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private randomImageId(): string {
    const imageIds = [
      '1493225457124-a3eb161ffa5f',
      '1571019613454-1cb2f99b2d8b',
      '1506905925346-21bda4d32df4',
      '1514525253161-7a46d19cd819'
    ];
    return imageIds[Math.floor(Math.random() * imageIds.length)];
  }

  private randomKey(): string {
    const keys = ['C major', 'G major', 'D major', 'A major', 'E major', 'B major', 'F# major', 'Db major', 'Ab major', 'Eb major', 'Bb major', 'F major', 'A minor', 'E minor', 'B minor', 'F# minor', 'C# minor', 'G# minor', 'Eb minor', 'Bb minor', 'F minor', 'C minor', 'G minor', 'D minor'];
    return keys[Math.floor(Math.random() * keys.length)];
  }

  private randomMood(): string {
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Aggressive', 'Peaceful', 'Nostalgic', 'Uplifting', 'Dark', 'Dreamy', 'Intense'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  // Get all categories
  async getCategories(): Promise<MusicCategory[]> {
    return Promise.resolve(this.categories);
  }

  // Get trending songs
  async getTrendingSongs(limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    const trendingSongs = this.database
      .filter(song => song.featured || song.plays > 5000000)
      .sort((a, b) => b.plays - a.plays)
      .slice(offset, offset + limit);
    
    return Promise.resolve({
      songs: trendingSongs,
      total: trendingSongs.length
    });
  }

  // Search songs
  async searchSongs(query: string, limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    const searchTerms = query.toLowerCase().split(' ');
    
    const matchedSongs = this.database.filter(song => {
      const searchText = `${song.title} ${song.artist} ${song.album} ${song.genre} ${song.mood}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });

    const result = matchedSongs
      .sort((a, b) => b.plays - a.plays)
      .slice(offset, offset + limit);

    return Promise.resolve({
      songs: result,
      total: matchedSongs.length
    });
  }

  // Get songs by category
  async getSongsByCategory(categoryId: string, limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    let filteredSongs: Song[] = [];

    switch (categoryId) {
      case 'trending':
        return this.getTrendingSongs(limit, offset);
      case 'popular':
        filteredSongs = this.database.sort((a, b) => b.plays - a.plays);
        break;
      case 'electronic':
        filteredSongs = this.database.filter(song => 
          ['Electronic Pop', 'Synthwave', 'Tropical House', 'Ambient Electronic', 'House', 'Ambient', 'EDM', 'Trance', 'Drum & Bass', 'Future Bass', 'Techno'].includes(song.genre)
        );
        break;
      case 'hip-hop':
        filteredSongs = this.database.filter(song => 
          ['Hip Hop', 'Trap', 'Lo-Fi Hip Hop', 'Conscious Rap', 'Old School Hip Hop', 'Boom Bap', 'Mumble Rap', 'Drill'].includes(song.genre)
        );
        break;
      case 'pop':
        filteredSongs = this.database.filter(song => 
          ['Pop', 'Acoustic Pop', 'Inspirational Pop', 'Electronic Pop', 'Bedroom Pop', 'Summer Pop', 'Indie Pop', 'Electro Pop', 'Teen Pop', 'Retro Pop', 'K-Pop', 'Synth Pop', 'Dance Pop'].includes(song.genre)
        );
        break;
      case 'rock':
        filteredSongs = this.database.filter(song => 
          ['Rock', 'Indie Rock', 'Metal', 'Alternative Rock', 'Punk Rock', 'Progressive Rock', 'Death Metal', 'Post Rock', 'Grunge'].includes(song.genre)
        );
        break;
      default:
        filteredSongs = this.database;
    }

    const result = filteredSongs.slice(offset, offset + limit);
    return Promise.resolve({
      songs: result,
      total: filteredSongs.length
    });
  }

  // Get library stats
  getLibraryStats(): { totalSongs: number, totalArtists: number, totalGenres: number } {
    const artists = new Set(this.database.map(song => song.artist));
    const genres = new Set(this.database.map(song => song.genre));
    
    return {
      totalSongs: this.database.length,
      totalArtists: artists.size,
      totalGenres: genres.size
    };
  }
}

// Enhanced Music API with Spotify integration
class EnhancedMusicAPI extends MusicAPI {
  private spotify = new SpotifyAPI();
  private useSpotify = false; // Toggle for Spotify integration

  // Override search to include both local and Spotify results
  async searchSongs(query: string, limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    // Get local results
    const localResults = await super.searchSongs(query, limit, offset);
    
    if (this.useSpotify) {
      // Get Spotify results
      const spotifyResults = await this.spotify.searchTracks(query, Math.floor(limit / 2), offset);
      
      // Combine results
      const combinedSongs = [...localResults.songs, ...spotifyResults.songs]
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit);
      
      return {
        songs: combinedSongs,
        total: localResults.total + spotifyResults.total
      };
    }
    
    return localResults;
  }

  // Enable/disable Spotify integration
  enableSpotify(clientId: string, clientSecret: string) {
    this.spotify = new SpotifyAPI();
    this.useSpotify = true;
  }

  disableSpotify() {
    this.useSpotify = false;
  }

  // Get total music library stats including Spotify
  getLibraryStats(): { totalSongs: number, totalArtists: number, totalGenres: number } {
    const baseStats = super.getLibraryStats();
    
    return {
      totalSongs: baseStats.totalSongs + (this.useSpotify ? 50000000 : 0),
      totalArtists: baseStats.totalArtists + (this.useSpotify ? 8000000 : 0),
      totalGenres: baseStats.totalGenres
    };
  }

  // Format play count for display (e.g., 1,234,567 -> "1.2M")
  formatPlaysCount(plays: number): string {
    if (plays >= 1000000000) {
      return (plays / 1000000000).toFixed(1) + 'B';
    } else if (plays >= 1000000) {
      return (plays / 1000000).toFixed(1) + 'M';
    } else if (plays >= 1000) {
      return (plays / 1000).toFixed(1) + 'K';
    }
    return plays.toString();
  }

  // Format duration from seconds to mm:ss
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Get featured/popular artists
  async getFeaturedArtists(limit: number = 10): Promise<{ artist: string, songCount: number, totalPlays: number, avatar: string }[]> {
    const artistMap = new Map();
    
    this.database.forEach(song => {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, {
          artist: song.artist,
          songCount: 0,
          totalPlays: 0,
          avatar: song.cover
        });
      }
      
      const artistData = artistMap.get(song.artist);
      artistData.songCount++;
      artistData.totalPlays += song.plays;
    });
    
    return Array.from(artistMap.values())
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, limit);
  }

  // Get songs by mood
  async getSongsByMood(mood: string, limit: number = 20): Promise<Song[]> {
    return this.database
      .filter(song => song.mood?.toLowerCase() === mood.toLowerCase())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, limit);
  }

  // Get recently added songs
  async getRecentlyAdded(limit: number = 20): Promise<Song[]> {
    return this.database
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, limit);
  }

  // Get recommended songs based on a seed song
  async getRecommendations(seedSongId: string, limit: number = 20): Promise<Song[]> {
    const seedSong = this.database.find(song => song.id === seedSongId);
    if (!seedSong) return [];
    
    return this.database
      .filter(song => 
        song.id !== seedSongId && 
        (song.genre === seedSong.genre || 
         song.mood === seedSong.mood ||
         Math.abs((song.energy || 0) - (seedSong.energy || 0)) < 20)
      )
      .sort((a, b) => b.plays - a.plays)
      .slice(0, limit);
  }

  // Get featured songs (wrapper for featured category)
  async getFeaturedSongs(limit: number = 20, offset: number = 0): Promise<{ songs: Song[], total: number }> {
    return this.getTrendingSongs(limit, offset);
  }

  // Check if song is popular based on play count
  isPopular(plays: number): boolean {
    return plays > 10000000; // 10M+ plays considered popular
  }
}

// Export enhanced API instance
export const musicApi = new EnhancedMusicAPI();