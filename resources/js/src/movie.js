'use strict'

class Movie extends Config{
    constructor(){
        super()
        
        this.poster_el=document.querySelector('.movie__poster')
        this.description_el=document.querySelector('.movie__description')
        this.title_el=document.querySelector('.movie__title')
        this.genre=document.querySelector('.movie__genre')
        this.release=document.querySelector('.movie__release-date')
        this.language=document.querySelector('.movie__language')
        this.rating=document.querySelector('.movie__rating')
        this.video=document.querySelector('.movie__video')
        this.carousel=document.querySelector('.movie__carousel')
        this.movie_text=document.querySelector('.movie__text-description')
        this.movie_video=document.querySelector('.movie__poster-icon')
        this.movie_overlay=document.querySelector('.movie__overlay')
        this.movie_iframe=document.querySelector('.movie__iframe')
        this.video_id=null

        this.iframe_close=document.querySelector('.movie__iframe-close')

        this.movie_id=this.getUrlVars()

        this.getMovie()
        this.getImages()
        //this.getVideo()
        this.playVideo()
        this.closeIframe()

    }

    getUrlVars() {
        let id=null;
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            id = value;
        });
        return id
    }

    getMovie(){
        fetch(this.moviedb_base_url+this.movie_id+'?api_key='+this.moviedb_api_key,
        {method:"GET"})
        .then(response=>{
            return response.json()
        })
        .then(data=>{
            this.fetchSuccess(data)
        }).catch(error=>{
            console.log()
        })

    }

    fetchSuccess(data){
       
        console.log(data)

        //poster image
        let img=document.createElement('img')
        img.setAttribute('src',this.moviedb_image_path+data['backdrop_path'])
        img.setAttribute('class','movie__poster-img')
        this.poster_el.appendChild(img)

        //title
        this.title_el.textContent=data['title']
        //releasedate
        this.release.textContent='release date : '+data['release_date'];

        
        //languages
        data['spoken_languages'].forEach(lan => {
           
            let span=document.createElement('span')
            span.setAttribute('class','movie__language-lang')
            span.textContent=lan['name']+" . "
            this.language.appendChild(span)

        });

        //genre

        data['genres'].forEach(genre=>{
            let span=document.createElement('span')
            span.setAttribute('class','movie__genre-type')
            span.textContent=genre['name']
            this.genre.appendChild(span)
        })

        //rating

        this.rating.textContent="IMDB rating : "+data['vote_average'] + ' / 10'

        let button=document.createElement('button')
        button.setAttribute('class','movie__button-ticket')
        button.textContent='Ticket'

        this.description_el.appendChild(button);

        //description
        this.movie_video.setAttribute('data-id',data['id'])

        this.movie_text.textContent=data['overview']

        
    }

    getImages(){
        fetch(this.moviedb_base_url+this.movie_id+'/images?api_key='+this.moviedb_api_key,
        {method:"GET"})
        .then(response=>{
            return response.json()
        })
        .then(data=>{
            this.fetchImages(data)
        }).catch(error=>{
            console.log()
        })
    }

    fetchImages(data){
        $('.movie__carousel').slick('unslick');
        
        console.log(data);
        data['backdrops'].forEach(image=>{

            let div=document.createElement('div')
            let img=document.createElement('img')
            img.setAttribute('src',this.moviedb_image_path+image['file_path'])
            img.setAttribute('class','movie__carousel-img')
            div.appendChild(img)
            this.carousel.appendChild(div)
        })

        $('.movie__carousel').slick({
            autoplay:true,
            infinite:true,
            fade:false,
            autoplaySpeed:2000,
            useTransform: false,
            prevArrow:$('.banner__prev'),
            nextArrow:$('.banner__next'),
            pauseOnFocus:false
        });
    }

    getVideo(movie_id){
        
        fetch(this.moviedb_base_url+movie_id+'/videos?api_key='+this.moviedb_api_key,
        {method:"GET"})
        .then(response=>{
            return response.json()
        })
        .then(data=>{
           this.fetchVideos(data)
            
        }).catch(error=>{
            console.log(error)
        })
       
    }

    fetchVideos(data){

        const embed='https://www.youtube.com/embed/'
        

        this.video_id=data['results'][0]['key']

        this.movie_iframe.setAttribute('src',embed+this.video_id+'?autoplay=1')
        this.movie_overlay.classList.add('movie__overlay--open')
      
    }

    playVideo(){
        this.movie_video.addEventListener('click',()=>{
            let data_id=this.movie_video.getAttribute('data-id')
            let youtube_id=this.getVideo(data_id)
        })

        window.addEventListener('click',(e)=>{
            console.log(e.target)
        })
    }

    closeIframe(){
        this.iframe_close.addEventListener('click',()=>{
            if(this.movie_overlay.classList.contains('movie__overlay--open')){
                this.movie_overlay.classList.remove('movie__overlay--open')
            }
        })
    }

  
}

    new Movie();


