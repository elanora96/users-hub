const BASE_URL = "https://jsonplace-univclone.herokuapp.com";

function renderUser(user) {
  const element = $(`<div class="user-card">
    <header>
      <h2>${user.name}</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b> ${user.email}</p>
      <p><b>Works for:</b> ${user.company.name}</p>
      <p><b>Company creed:</b> "${user.company.catchPhrase}, which will ${user.company.bs}!"</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${user.username}</button>
      <button class="load-albums">ALBUMS BY ${user.username}</button>
    </footer>
  </div>`);

  element.data("user", user);

  return element;
}

function renderUserList(userList) {
  $("#user-list").empty();

  userList.forEach(function (user) {
    const element = renderUser(user);
    $("#user-list").append(element);
  });
}

/* render a single album */
function renderAlbum(album) {
  const element = $(`<div class="album-card">
    <header>
      <h3>${album.title}, by ${album.user.username} </h3>
    </header>
    <section class="photo-list"></section>
  </div>`);

  const photoList = element.find(".photo-list");

  album.photos.forEach(function (photo) {
    const photoElement = renderPhoto(photo);
    photoList.append(photoElement);
  });

  return element;
}

/* render a single photo */
function renderPhoto(photo) {
  return `<div class="photo-card">
    <a href="${photo.url}" target="_blank">
      <img src="${photo.thumbnailUrl}">
      <figure>${photo.title}</figure>
    </a>
  </div>`;
}

/* render an array of albums */
function renderAlbumList(albumList) {
  $("#app section.active").removeClass("active");
  $("#album-list").empty().addClass("active");

  albumList.forEach(function (album) {
    const albumElement = renderAlbum(album);
    $("#album-list").append(albumElement);
  });
}

function fetchData(url) {
  return fetch(url)
    .then(function (response) {
      // call json on the response, and return the result
      return response.json();
    })
    .catch(function (error) {
      // use console.error to log out any error
      console.error(error);
    });
}

function fetchUsers() {
  return fetchData(`${BASE_URL}/users`);
}

/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {
  return fetchData(
    `${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`
  );
}

function bootstrap() {
  fetchUsers().then(function (data) {
    renderUserList(data);
  });
}

$("#user-list").on("click", ".user-card .load-posts", function () {
  // load posts for this user
  const parent = $(this).closest(".user-card").data("user");
  console.log(parent.username);
  // render posts for this user
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  // load albums for this user
  const parent = $(this).closest(".user-card").data("user");
  fetchUserAlbumList(parent.id).then(function (albumList) {
    renderAlbumList(albumList);
  });
  // render albums for this user
});

bootstrap();
