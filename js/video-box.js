document.addEventListener('DOMContentLoaded', function() {
    const videoHTML = `
        <div class="video-box-container" id="videoBox">
            <i class="fa fa-times-circle video-close-btn" id="videoClose" title="Close"></i>
            <div class="video-wrapper">

                <iframe 
                    id="youtubeVideo"
                    src="https://www.youtube.com/embed/Z4eIXX8rXYw?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&enablejsapi=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;


    document.body.insertAdjacentHTML('beforeend', videoHTML);

    const videoBox = document.getElementById('videoBox');
    const videoClose = document.getElementById('videoClose');
    const videoExpand = document.getElementById('videoExpand');
    const iframe = document.getElementById('youtubeVideo');

    videoClose.onclick = function(e) {
        e.stopPropagation();
        videoBox.style.display = 'none';
        // Stop video
        iframe.src = iframe.src;
    };
});

