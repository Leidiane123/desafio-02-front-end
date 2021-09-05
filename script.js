const movies=document.querySelector('.movies');
const movie=document.querySelectorAll('.movie');


const btnPrev=document.querySelector(".btn-prev");
const btnNext=document.querySelector(".btn-next");

const input=document.querySelector('.input');

const modal=document.querySelector('.modal');
const imgFecharModal=document.querySelector('.modal__close');

const tituloModal=document.querySelector('.modal__title');
const imgModal=document.querySelector('.modal__img');
const descricaoModal=document.querySelector('.modal__description');
const containerGenres=document.querySelector(".modal__genres");
const votosModal=document.querySelector('.modal__average');

const imgVideo=document.querySelector('.highlight__video');
const linkVideo=document.querySelector('.highlight__video-link');
const highlightTitulo=document.querySelector('.highlight__title');
const highlightVotos=document.querySelector('.highlight__rating');
const highlightGenres=document.querySelector('.highlight__genres');
const highlightData=document.querySelector('.highlight__launch');
const highlightDescricao=document.querySelector('.highlight__description');


let indice=0;
let filmes=[]
let dadosFilmes=[];

let novobuscaFilme=[];

function preencherModal(elemento,ind,filmes){
    elemento.addEventListener('click',function(){
        
        modal.classList.remove('hidden');
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${filmes[ind].id}?language=pt-BR`).then(function(resposta){
            const promiseCorpo=resposta.json();
            console.log(ind,filmes[ind].id)

            promiseCorpo.then(function(body){
                
                tituloModal.textContent=body.title;
                imgModal.src=body.backdrop_path;
                descricaoModal.textContent=body.overview;

                containerGenres.innerHTML="";
                body.genres.forEach(genre=>{
                    const textoGenre=document.createElement('span');
                    textoGenre.classList.add("modal__genre");
                    textoGenre.textContent=genre.name;
                    containerGenres.append(textoGenre);

                });
                votosModal.textContent=body.vote_average;

                
            });
        });
        
    });
};

function paginar(filme){
    movies.innerHTML="";
    
    for(let i=indice; i<indice +5;i++){
        
        const div=document.createElement('div');
        div.classList.add('movie');
       
        preencherModal(div,i,filme)
        
        
        div.style.backgroundImage='url('+filme[i].poster_path+')';
        
        const divInf=document.createElement('div');
        divInf.classList.add('movie__info');

        const title=document.createElement('span');
        title.classList.add('movie__title');
        title.classList.add('font01');
        title.innerHTML=filme[i].title;

        const img=document.createElement('img');
        img.classList.add('movie__img');
        img.src='./assets/estrela.svg';

        const voto=document.createElement('span');
        voto.classList.add('movie__rating');
        voto.textContent=filme[i].vote_average;
    
        voto.append(img);
        divInf.append(title,voto);
        div.append(divInf);
        movies.append(div);
       
    };
    
};


function btns(preencherModal){
    
    btnPrev.addEventListener('click',function(){
        
        if(indice===0){
            
            indice=15;
            
        }else{
            indice-=5;
        }
        paginar(preencherModal)
        
        
    });
    btnNext.addEventListener('click', function(){
        if(indice===15){
            
            indice=0;
            
        }else{
            indice+=5
            
        }
        paginar(preencherModal)
        
    });

};

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function(resposta){
    const promiseBody=resposta.json();

    promiseBody.then(function(body){
        
        dadosFilmes=body.results;

        for(let item of dadosFilmes){
            filmes.push(item);
        }
        paginar(dadosFilmes);
        
        btns(dadosFilmes);
        
    });
    
});

input.addEventListener('keydown', function(event){
    if(event.code==='Enter'){
        if(input.value===''){
            paginar(filmes)
            return
        };
        
        const pesquisa=input.value;

        fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query='+pesquisa).then(function(resposta){
            const promiseBody=resposta.json();

            promiseBody.then(function(body){
                const buscaFilmes=body.results;

                for(let item of buscaFilmes){
                    novobuscaFilme.push(item)
                }
                
                paginar(novobuscaFilme);
               
                btns(novobuscaFilme);
                input.value='';
            });
        });

    };
});


imgFecharModal.addEventListener('click',()=>{
    modal.classList.add('hidden');
    
    imgModal.src=" ";
    
});
modal.addEventListener('click',()=>{
    modal.classList.add('hidden');
    
    imgModal.src=" ";
    
});


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function(resposta){
    const promiseBody=resposta.json();
    
    promiseBody.then(function(body){
        imgVideo.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.6) 100%, rgba(0,0,0,0.6) 100%), url('${body.backdrop_path}')`;
        highlightTitulo.textContent=body.title;
        highlightVotos.textContent=body.vote_average;
        let genres=[]
        for(let item of body.genres){
            genres.push(item.name)
        }
        highlightGenres.textContent=genres.join(", ");
        highlightData.textContent=body.release_date;
        highlightDescricao.textContent=body.overview;
        
    });
});

linkVideo.addEventListener('click',function(){
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(function(resposta){
        const promiseBody=resposta.json();
        
        promiseBody.then(function(body){
            linkVideo.href=`https://www.youtube.com/watch?v=${body.results[0].key}`
            
            
        });
    });

});


