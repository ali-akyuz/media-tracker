export const moviesData = [
  {
    id: 1,
    title: "Yıldızlararası Yolculuk",
    poster: "/images/movie_poster_1_1773529217886.png",
    rating: 9.5,
    notes: "Uzay ve zamanın ötesinde akıl almaz bir macera.",
    dateWatched: "2023-11-15",
    status: "watched" // watched, watchlist
  },
  {
    id: 2,
    title: "Neon Gölgeler",
    poster: "/images/movie_poster_2_1773529231659.png",
    rating: 8.0,
    notes: "Harika sinematografiye sahip sürükleyici bir gerilim.",
    dateWatched: "",
    status: "watchlist"
  }
];

export const seriesData = [
  {
    id: 1,
    title: "Ejderha Tepesi",
    poster: "/images/series_poster_1_1773529250205.png",
    rating: 9.0,
    notes: "Destansı savaşlar ve derin bir hikaye evreni.",
    status: "completed", // watching, completed
    season: 4,
    episode: 10
  },
  {
    id: 2,
    title: "Tuhaf Aile",
    poster: "/images/series_poster_2_1773529268553.png",
    rating: 7.5,
    notes: "Karakterler hem çok komik hem de çok içten.",
    status: "watching",
    season: 2,
    episode: 5
  }
];

export const booksData = [
  {
    id: 1,
    title: "Sessiz Yankı",
    poster: "/images/book_cover_1_1773529286324.png",
    author: "Elena Vance",
    rating: 8.5,
    notes: "Çok güzel yazılmış, sakinleştirici bir roman.",
    dateFinished: "2023-09-02",
    status: "read" // read, to_read
  },
  {
    id: 2,
    title: "Neon Ufuklar",
    poster: "/images/book_cover_2_1773529300755.png",
    author: "James T. Wright",
    rating: 0,
    notes: "Başlamak için sabırsızlanıyorum.",
    dateFinished: "",
    status: "to_read"
  }
];

export const notesData = [
  {
    id: 1,
    title: "Yıldızlararası Yolculuk İncelemesi",
    content: "Filmin en iyi kısmı kesinlikle müzikleriydi. Görsel efektlerle mükemmel bir uyum içindeydi.",
    type: "movies",
    date: "2023-11-16"
  },
  {
    id: 2,
    title: "Ejderha Tepesi 4. Sezon Teorileri",
    content: "Bence ufak ipuçlarına bakılırsa prens gelecek sezon krallığa ihanet edecek.",
    type: "series",
    date: "2023-10-05"
  }
];

export const plannerData = {
  Pazartesi: [{ id: 1, type: "movie", label: "Yıldızlararası Yolculuk'u tekrar izle" }],
  Salı: [{ id: 2, type: "book", label: "Neon Ufuklar'dan bir bölüm oku" }],
  Çarşamba: [],
  Perşembe: [{ id: 3, type: "series", label: "Tuhaf Aile yeni bölüm" }],
  Cuma: [{ id: 4, type: "movie", label: "Film Gecesi: Neon Gölgeler" }],
  Cumartesi: [],
  Pazar: [{ id: 5, type: "book", label: "Sessiz Yankı incelemesini bitir" }]
};
