/*
* Arfa Abdelmonem - Official Quran Recitations
* Main Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initAudioPlayer();
    initVideoInteractions();
    initSearch();
});

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            btn.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
}

/* --- Theme Logic --- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(false);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme === 'dark');
        });
    }
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    themeToggle.textContent = isDark ? '☀️' : '🌙'; 
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
}

/* --- Audio Player Logic --- */
let audio = new Audio();
let currentTrackIndex = -1;
let isPlaying = false;
let tracks = [];

function initAudioPlayer() {
    // Collect all tracks from the DOM logic
    const trackElements = document.querySelectorAll('.audio-item');
    trackElements.forEach((el, index) => {
        tracks.push({
            src: el.getAttribute('data-src'),
            title: el.getAttribute('data-title'),
            element: el,
            index: index
        });
        
        // Add click event to play button
        const playBtn = el.querySelector('.play-btn');
        playBtn.addEventListener('click', () => {
            if (currentTrackIndex === index && isPlaying) {
                pauseAudio();
            } else {
                playTrack(index);
            }
        });
    });

    // Sticky Player Controls
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const seekBar = document.getElementById('seek-bar');
    
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    
    // Seek Bar interaction
    seekBar.addEventListener('input', () => {
        const time = (seekBar.value / 100) * audio.duration;
        audio.currentTime = time;
    });

    // Audio Events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
}

function playTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    
    const track = tracks[index];
    
    // If different track, load it
    if (currentTrackIndex !== index) {
        audio.src = track.src;
        currentTrackIndex = index;
        updatePlayerUI(track);
    }
    
    audio.play().catch(e => console.log("Audio play failed (user interaction needed likely)", e));
    isPlaying = true;
    updatePlayIcons();
    showStickyPlayer();
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    updatePlayIcons();
}

function togglePlay() {
    if (currentTrackIndex === -1 && tracks.length > 0) {
        playTrack(0);
    } else if (isPlaying) {
        pauseAudio();
    } else {
        audio.play();
        isPlaying = true;
        updatePlayIcons();
    }
}

function playNext() {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) nextIndex = 0; // Loop listener
    playTrack(nextIndex);
}

function playPrev() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    playTrack(prevIndex);
}

function updatePlayerUI(track) {
    document.getElementById('current-track-title').textContent = track.title;
}

function updatePlayIcons() {
    const mainBtn = document.getElementById('play-pause-btn');
    mainBtn.textContent = isPlaying ? '⏸' : '▶';
    
    // Update list icons
    tracks.forEach((t, i) => {
        const btn = t.element.querySelector('.play-btn');
        if (i === currentTrackIndex) {
            btn.textContent = isPlaying ? '⏸' : '▶';
            t.element.style.borderColor = isPlaying ? 'var(--primary-color)' : 'transparent';
        } else {
            btn.textContent = '▶';
            t.element.style.borderColor = 'transparent';
        }
    });
}

function showStickyPlayer() {
    const player = document.getElementById('sticky-player');
    player.classList.remove('hidden');
    // Ensure padding at bottom of body so player doesn't cover content
    document.body.style.paddingBottom = '100px';
}

function updateProgress() {
    if (isNaN(audio.duration)) return;
    
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    const percent = (audio.currentTime / audio.duration) * 100;
    seekBar.value = percent;
    
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* --- Search Logic --- */
function initSearch() {
    const searchInput = document.getElementById('audio-search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        tracks.forEach(t => {
            if (t.title.includes(term)) {
                t.element.classList.remove('hidden');
            } else {
                t.element.classList.add('hidden');
            }
        });
    });
}

/* --- Video Logic (Placeholder) --- */
function initVideoInteractions() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            alert('سيتم تشغيل الفيديو قريباً. (This is a placeholder for video modal)');
        });
    });
}
