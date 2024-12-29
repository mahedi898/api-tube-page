function getTimeString(time) {
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond/60);
    remainingSecond = remainingSecond % 60;
    return`${hour}hour ${minute} minute ${remainingSecond} second ago`
}


// 1- fetch, load and show categories on html

// create loadCategories

const loadCategories = () => {
  // fetch the data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

// create loadVideos

const loadVideos = (searchTex = "") => {
  // fetch the data
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchTex}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

// create displayVideos
const displayVideos = (videos) => {
  const videosContainer = document.getElementById("videos-container");
  videosContainer.innerHTML = "";
    if (videos.length === 0) {
        videosContainer.classList.remove("grid")
        videosContainer.innerHTML = `
        <div class="min-h-[200px] flex flex-col gap-5 justify-center items-center">
        <img src="assets/Icon.png"/>
        </div>

        <h2 class="text-center text-xl font-extrabold">
        Oops!! Sorry, There is no content here
        </h2>
        `;
        return;
    }
    else{
        videosContainer.classList.add("grid")
    }

  videos.forEach((video) => {
    // console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
  <figure class = "h-[200px] relative">
    <img
      src=${video.thumbnail}
      class = "h-full w-full object-cover"
      alt="Shoes" />
      ${
        video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-xs">${getTimeString(video.others.posted_date)}</span>`
      }
    
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
    <img class="w-8 h-8 rounded-full object-cover" src = ${video.authors[0].profile_picture} />
    </div>
    <div>
    <h2 class = "font-bold">${video.title} </h2>
    <div class="flex gap-2 items-center">
    <p class="text-gray-400">${video.authors[0].profile_name}</p>
    ${video.authors[0].verified === true ?`<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>`: ""}
    </div>
    <p>
    <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error text-white"> details
    </button>
    </p>
    </div>
  </div>
        `;
    videosContainer.append(card);
  });
};
// load details

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video)
}

const displayDetails = (video) => {
    console.log(video);
    const detailContainer = document.getElementById("modal-content");
    detailContainer.innerHTML =`
    <img src= ${video.thumbnail} />
    <p>
    ${video.description}
    </p>
    `

    // way-1 
    // document.getElementById("showModalData").click();
    // way-2 
    document.getElementById("my_modal_5").showModal();
    
}
// remove active class function

const removeActiveClass= () => {
    const button = document.getElementsByClassName("category-btn");
    for(let btn of button){
        btn.classList.remove("active")
    }    
    
}


// load categories function
function loadCategoryVideos(id) {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {

        removeActiveClass()
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active")           
        
        displayVideos(data.category);
})
    .catch((error) => console.log(error));

}

//  create displayCategories
const displayCategories = (categories) => {
  // add data in html
  const categoryContainer = document.getElementById("category");
  categories.forEach((item) => {
    // create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick = "loadCategoryVideos(${item.category_id})" class = "btn category-btn">
    ${item.category}
    </button>
    `
    categoryContainer.appendChild(buttonContainer);
  });
};
document.getElementById("search-input").addEventListener("keyup",(e)=>{
    loadVideos(e.target.value);
 
})
loadCategories();
loadVideos();
