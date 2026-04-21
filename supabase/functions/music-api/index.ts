import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Comprehensive Music Database
const MUSIC_DATABASE = {
  trending: [
    { id: '1', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20', genre: 'Pop', year: 2022, plays: 2500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '2', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: '3:20', genre: 'Pop', year: 2023, plays: 2200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '3', title: 'Unholy (feat. Kim Petras)', artist: 'Sam Smith', album: 'Gloria', duration: '2:36', genre: 'Pop', year: 2022, plays: 2000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '4', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration: '2:47', genre: 'Pop Rock', year: 2022, plays: 1900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '5', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58', genre: 'Indie Pop', year: 2020, plays: 1800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '6', title: 'positions', artist: 'Ariana Grande', album: 'Positions', duration: '2:52', genre: 'R&B Pop', year: 2020, plays: 1700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '7', title: 'Lavender Haze', artist: 'Taylor Swift', album: 'Midnights', duration: '3:22', genre: 'Dream Pop', year: 2022, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '8', title: 'thank u, next', artist: 'Ariana Grande', album: 'thank u, next', duration: '3:27', genre: 'Pop', year: 2018, plays: 1500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
  ],
  
  popular: [
    { id: '101', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', genre: 'Synthpop', year: 2019, plays: 3200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '102', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', duration: '3:53', genre: 'Pop', year: 2017, plays: 3100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '103', title: 'Someone You Loved', artist: 'Lewis Capaldi', album: 'Divinely Uninspired', duration: '3:02', genre: 'Pop Ballad', year: 2018, plays: 2800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '104', title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', duration: '4:23', genre: 'Pop Ballad', year: 2017, plays: 2700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '105', title: 'Sunflower', artist: 'Post Malone & Swae Lee', album: 'Spider-Man: Into the Spider-Verse', duration: '2:38', genre: 'Hip Hop', year: 2018, plays: 2600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '106', title: '7 rings', artist: 'Ariana Grande', album: 'thank u, next', duration: '2:58', genre: 'Trap Pop', year: 2019, plays: 2400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '107', title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', duration: '3:39', genre: 'Pop', year: 2014, plays: 2300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '108', title: 'bad guy', artist: 'Billie Eilish', album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', duration: '3:14', genre: 'Electropop', year: 2019, plays: 2200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '109', title: 'Blank Space', artist: 'Taylor Swift', album: '1989', duration: '3:51', genre: 'Pop', year: 2014, plays: 2100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '110', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', genre: 'Pop Rock', year: 2021, plays: 2000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
  ],

  hiphop: [
    { id: '201', title: 'God\'s Plan', artist: 'Drake', album: 'Scorpion', duration: '3:19', genre: 'Hip Hop', year: 2018, plays: 2400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '202', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', duration: '2:57', genre: 'Hip Hop', year: 2017, plays: 1900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '203', title: 'Sicko Mode', artist: 'Travis Scott ft. Drake', album: 'Astroworld', duration: '5:12', genre: 'Hip Hop', year: 2018, plays: 1800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '204', title: 'Lucid Dreams', artist: 'Juice WRLD', album: 'Goodbye & Good Riddance', duration: '3:59', genre: 'Hip Hop', year: 2018, plays: 1700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '205', title: 'Old Town Road', artist: 'Lil Nas X ft. Billy Ray Cyrus', album: '7 EP', duration: '2:37', genre: 'Country Rap', year: 2019, plays: 2300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '206', title: 'Hotline Bling', artist: 'Drake', album: 'Views', duration: '4:27', genre: 'Hip Hop', year: 2015, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '207', title: 'ROCKSTAR', artist: 'Post Malone ft. 21 Savage', album: 'beerbongs & bentleys', duration: '3:38', genre: 'Hip Hop', year: 2017, plays: 1500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
  ],

  rock: [
    { id: '301', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', genre: 'Rock', year: 1975, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '302', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration: '5:03', genre: 'Hard Rock', year: 1987, plays: 1400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '303', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration: '5:01', genre: 'Grunge', year: 1991, plays: 1200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '304', title: 'Don\'t Stop Believin\'', artist: 'Journey', album: 'Escape', duration: '4:11', genre: 'Rock', year: 1981, plays: 1100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '305', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30', genre: 'Rock', year: 1976, plays: 1000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '306', title: 'We Will Rock You', artist: 'Queen', album: 'News of the World', duration: '2:02', genre: 'Arena Rock', year: 1977, plays: 900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '307', title: 'Thunderstruck', artist: 'AC/DC', album: 'The Razors Edge', duration: '4:52', genre: 'Hard Rock', year: 1990, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
  ],

  electronic: [
    { id: '401', title: 'Titanium', artist: 'David Guetta ft. Sia', album: 'Nothing but the Beat', duration: '4:05', genre: 'EDM', year: 2011, plays: 1500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '402', title: 'Levels', artist: 'Avicii', album: 'True', duration: '3:18', genre: 'Progressive House', year: 2011, plays: 1300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '403', title: 'Bangarang', artist: 'Skrillex', album: 'Bangarang', duration: '3:35', genre: 'Dubstep', year: 2011, plays: 900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '404', title: 'Animals', artist: 'Martin Garrix', album: 'Animals', duration: '5:05', genre: 'Big Room', year: 2013, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '405', title: 'Clarity', artist: 'Zedd ft. Foxes', album: 'Clarity', duration: '4:31', genre: 'Progressive House', year: 2012, plays: 700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '406', title: 'Wake Me Up', artist: 'Avicii', album: 'True', duration: '4:07', genre: 'Progressive House', year: 2013, plays: 1200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '407', title: 'Closer', artist: 'The Chainsmokers ft. Halsey', album: 'Collage EP', duration: '4:04', genre: 'Electropop', year: 2016, plays: 1100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
  ],

  rb: [
    { id: '501', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', genre: 'R&B', year: 2019, plays: 3200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '502', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', genre: 'Pop Rock', year: 2021, plays: 2100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '503', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', genre: 'Disco Pop', year: 2020, plays: 2000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '504', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', genre: 'Pop Rock', year: 2019, plays: 1900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '505', title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '4:02', genre: 'Pop Ballad', year: 2021, plays: 1800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '506', title: 'Save Your Tears', artist: 'The Weeknd & Ariana Grande', album: 'After Hours (Deluxe)', duration: '3:35', genre: 'R&B Pop', year: 2021, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '507', title: 'breathin', artist: 'Ariana Grande', album: 'Sweetener', duration: '3:18', genre: 'Pop R&B', year: 2018, plays: 1400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '508', title: 'Love Me Harder', artist: 'Ariana Grande & The Weeknd', album: 'My Everything', duration: '3:56', genre: 'R&B Pop', year: 2014, plays: 1300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
  ],

  country: [
    { id: '601', title: 'The Good Ones', artist: 'Gabby Barrett', album: 'Goldmine', duration: '3:15', genre: 'Country', year: 2020, plays: 500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '602', title: 'Heartbreak Hotel', artist: 'Elvis Presley', album: 'Elvis Presley', duration: '2:08', genre: 'Country Rock', year: 1956, plays: 400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '603', title: 'Friends in Low Places', artist: 'Garth Brooks', album: 'No Fences', duration: '4:27', genre: 'Country', year: 1990, plays: 300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '604', title: 'Cruise', artist: 'Florida Georgia Line', album: 'Here\'s to the Good Times', duration: '3:36', genre: 'Country Pop', year: 2012, plays: 250000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '605', title: 'Body Like a Back Road', artist: 'Sam Hunt', album: 'Southside', duration: '2:46', genre: 'Country Pop', year: 2017, plays: 200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '606', title: 'Love Story (Taylor\'s Version)', artist: 'Taylor Swift', album: 'Fearless (Taylor\'s Version)', duration: '3:55', genre: 'Country Pop', year: 2021, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '607', title: 'You Belong With Me', artist: 'Taylor Swift', album: 'Fearless', duration: '3:51', genre: 'Country Pop', year: 2008, plays: 700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
  ],

  latin: [
    { id: '701', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', album: 'Vida', duration: '3:47', genre: 'Reggaeton', year: 2017, plays: 7000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '702', title: 'Havana', artist: 'Camila Cabello ft. Young Thug', album: 'Camila', duration: '3:37', genre: 'Latin Pop', year: 2017, plays: 2500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '703', title: 'Gasolina', artist: 'Daddy Yankee', album: 'Barrio Fino', duration: '3:12', genre: 'Reggaeton', year: 2004, plays: 1200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '704', title: 'Bailando', artist: 'Enrique Iglesias ft. Descemer Bueno', album: 'Sex and Love', duration: '4:04', genre: 'Latin Pop', year: 2014, plays: 1100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '705', title: 'Macarena', artist: 'Los Del Rio', album: 'A mí me gusta', duration: '4:12', genre: 'Latin Dance', year: 1993, plays: 900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '706', title: 'La Tortura', artist: 'Shakira ft. Alejandro Sanz', album: 'Fijación Oral, Vol. 1', duration: '3:33', genre: 'Latin Pop', year: 2005, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '707', title: 'Whenever, Wherever', artist: 'Shakira', album: 'Laundry Service', duration: '3:16', genre: 'Latin Rock', year: 2001, plays: 700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
  ],

  indie: [
    { id: '801', title: 'Somebody That I Used to Know', artist: 'Gotye ft. Kimbra', album: 'Making Mirrors', duration: '4:04', genre: 'Indie Pop', year: 2011, plays: 1800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '802', title: 'Pumped Up Kicks', artist: 'Foster the People', album: 'Torches', duration: '3:59', genre: 'Indie Pop', year: 2010, plays: 1400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '803', title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', duration: '3:49', genre: 'Psychedelic Pop', year: 2007, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '804', title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', duration: '3:57', genre: 'Indie Rock', year: 2004, plays: 600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '805', title: 'Young Folks', artist: 'Peter Bjorn and John', album: 'Writer\'s Block', duration: '4:36', genre: 'Indie Pop', year: 2006, plays: 500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '806', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', duration: '4:03', genre: 'Synth Pop', year: 2011, plays: 900000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '807', title: 'Ho Hey', artist: 'The Lumineers', album: 'The Lumineers', duration: '2:43', genre: 'Indie Folk', year: 2012, plays: 750000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
  ],

  taylorswift: [
    { id: '901', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20', genre: 'Pop', year: 2022, plays: 2500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '902', title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', duration: '3:39', genre: 'Pop', year: 2014, plays: 2300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '903', title: 'Blank Space', artist: 'Taylor Swift', album: '1989', duration: '3:51', genre: 'Pop', year: 2014, plays: 2100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '904', title: 'Lavender Haze', artist: 'Taylor Swift', album: 'Midnights', duration: '3:22', genre: 'Dream Pop', year: 2022, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '905', title: 'Love Story (Taylor\'s Version)', artist: 'Taylor Swift', album: 'Fearless (Taylor\'s Version)', duration: '3:55', genre: 'Country Pop', year: 2021, plays: 800000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '906', title: 'You Belong With Me', artist: 'Taylor Swift', album: 'Fearless', duration: '3:51', genre: 'Country Pop', year: 2008, plays: 700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '907', title: 'We Are Never Ever Getting Back Together', artist: 'Taylor Swift', album: 'Red', duration: '3:13', genre: 'Pop Country', year: 2012, plays: 650000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '908', title: 'Look What You Made Me Do', artist: 'Taylor Swift', album: 'reputation', duration: '3:31', genre: 'Electropop', year: 2017, plays: 600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '909', title: 'Bad Blood', artist: 'Taylor Swift ft. Kendrick Lamar', album: '1989', duration: '3:31', genre: 'Pop', year: 2015, plays: 550000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '910', title: 'Karma', artist: 'Taylor Swift', album: 'Midnights', duration: '3:24', genre: 'Pop', year: 2022, plays: 500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
  ],

  arianagrande: [
    { id: '1001', title: '7 rings', artist: 'Ariana Grande', album: 'thank u, next', duration: '2:58', genre: 'Trap Pop', year: 2019, plays: 2400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '1002', title: 'thank u, next', artist: 'Ariana Grande', album: 'thank u, next', duration: '3:27', genre: 'Pop', year: 2018, plays: 1500000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '1003', title: 'positions', artist: 'Ariana Grande', album: 'Positions', duration: '2:52', genre: 'R&B Pop', year: 2020, plays: 1700000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '1004', title: 'Save Your Tears', artist: 'The Weeknd & Ariana Grande', album: 'After Hours (Deluxe)', duration: '3:35', genre: 'R&B Pop', year: 2021, plays: 1600000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '1005', title: 'breathin', artist: 'Ariana Grande', album: 'Sweetener', duration: '3:18', genre: 'Pop R&B', year: 2018, plays: 1400000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '1006', title: 'Love Me Harder', artist: 'Ariana Grande & The Weeknd', album: 'My Everything', duration: '3:56', genre: 'R&B Pop', year: 2014, plays: 1300000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '1007', title: 'Problem', artist: 'Ariana Grande ft. Iggy Azalea', album: 'My Everything', duration: '3:14', genre: 'Pop', year: 2014, plays: 1200000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
    { id: '1008', title: 'Side To Side', artist: 'Ariana Grande ft. Nicki Minaj', album: 'Dangerous Woman', duration: '3:46', genre: 'Reggae Pop', year: 2016, plays: 1100000000, cover: 'https://i.scdn.co/image/ab67616d0000b273c4dee2f3e71e2ad6e6f4b0f8' },
    { id: '1009', title: 'Into You', artist: 'Ariana Grande', album: 'Dangerous Woman', duration: '4:04', genre: 'Dance Pop', year: 2016, plays: 1000000000, cover: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5' },
    { id: '1010', title: 'God is a woman', artist: 'Ariana Grande', album: 'Sweetener', duration: '3:17', genre: 'R&B Pop', year: 2018, plays: 950000000, cover: 'https://i.scdn.co/image/ab67616d0000b273f4d5f8d8b6f4b6e4e0f4d0b8' },
  ]
}

const ALL_SONGS = [
  ...MUSIC_DATABASE.trending,
  ...MUSIC_DATABASE.popular,
  ...MUSIC_DATABASE.hiphop,
  ...MUSIC_DATABASE.rock,
  ...MUSIC_DATABASE.electronic,
  ...MUSIC_DATABASE.rb,
  ...MUSIC_DATABASE.country,
  ...MUSIC_DATABASE.latin,
  ...MUSIC_DATABASE.indie,
  ...MUSIC_DATABASE.taylorswift,
  ...MUSIC_DATABASE.arianagrande
]

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let response: any = {}

    switch (action) {
      case 'search':
        if (query) {
          const searchResults = ALL_SONGS.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase()) ||
            song.genre.toLowerCase().includes(query.toLowerCase())
          )
          response = {
            success: true,
            data: {
              songs: searchResults.slice(offset, offset + limit),
              total: searchResults.length,
              query: query
            }
          }
        } else {
          response = {
            success: false,
            error: 'Search query is required'
          }
        }
        break

      case 'category':
        if (category && MUSIC_DATABASE[category as keyof typeof MUSIC_DATABASE]) {
          const categoryData = MUSIC_DATABASE[category as keyof typeof MUSIC_DATABASE]
          response = {
            success: true,
            data: {
              songs: categoryData.slice(offset, offset + limit),
              total: categoryData.length,
              category: category
            }
          }
        } else {
          response = {
            success: false,
            error: 'Invalid category'
          }
        }
        break

      case 'trending':
        response = {
          success: true,
          data: {
            songs: MUSIC_DATABASE.trending.slice(offset, offset + limit),
            total: MUSIC_DATABASE.trending.length
          }
        }
        break

      case 'categories':
        response = {
          success: true,
          data: {
            categories: [
              { id: 'trending', name: 'Trending Now', count: MUSIC_DATABASE.trending.length },
              { id: 'popular', name: 'Popular', count: MUSIC_DATABASE.popular.length },
              { id: 'taylorswift', name: 'Taylor Swift', count: MUSIC_DATABASE.taylorswift.length },
              { id: 'arianagrande', name: 'Ariana Grande', count: MUSIC_DATABASE.arianagrande.length },
              { id: 'hiphop', name: 'Hip Hop', count: MUSIC_DATABASE.hiphop.length },
              { id: 'rock', name: 'Rock', count: MUSIC_DATABASE.rock.length },
              { id: 'electronic', name: 'Electronic', count: MUSIC_DATABASE.electronic.length },
              { id: 'rb', name: 'R&B', count: MUSIC_DATABASE.rb.length },
              { id: 'country', name: 'Country', count: MUSIC_DATABASE.country.length },
              { id: 'latin', name: 'Latin', count: MUSIC_DATABASE.latin.length },
              { id: 'indie', name: 'Indie', count: MUSIC_DATABASE.indie.length }
            ]
          }
        }
        break

      case 'song':
        const songId = searchParams.get('id')
        if (songId) {
          const song = ALL_SONGS.find(s => s.id === songId)
          if (song) {
            response = {
              success: true,
              data: { song }
            }
          } else {
            response = {
              success: false,
              error: 'Song not found'
            }
          }
        } else {
          response = {
            success: false,
            error: 'Song ID is required'
          }
        }
        break

      case 'featured':
        // Mix of trending and popular songs
        const featured = [
          ...MUSIC_DATABASE.trending.slice(0, 2),
          ...MUSIC_DATABASE.taylorswift.slice(0, 2),
          ...MUSIC_DATABASE.arianagrande.slice(0, 2),
          ...MUSIC_DATABASE.popular.slice(0, 2),
          ...MUSIC_DATABASE.hiphop.slice(0, 2),
          ...MUSIC_DATABASE.electronic.slice(0, 2),
          ...MUSIC_DATABASE.rb.slice(0, 1)
        ]
        response = {
          success: true,
          data: {
            songs: featured.slice(offset, offset + limit),
            total: featured.length
          }
        }
        break

      default:
        response = {
          success: false,
          error: 'Invalid action. Available actions: search, category, trending, categories, song, featured'
        }
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Music API Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})