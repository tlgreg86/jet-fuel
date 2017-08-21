// form variables //

const folderName = $('.folder-input');
const dropDown = $('.dropbtn');
const submitFolder = $('.submit-folder');
const description = $('.description-input');
const longUrl = $('.url-input');
const submitUrl = $('.submit-url');

// functions //

const addFolderToDom = (folder) => {
  if (folder.id !== undefined) {
    dropDown.append(
      `<option class='folder' value='${folder.id}'>${folder.folder_name}</option>`,
    );
  }
};

const addUrlToDom = (url) => {
  const date = url.created_at;

  $('.header-form-wrapper').append(
    `<section class="url-viewer">
       <div class="url-list">
         <h3 class="url-title">${url.url_title}</h3>
         <a class="url-short" href="">${url.short_url}</a>
         <p class="url-date">${date}</p>
       </div>
     </section>`,
  );
};

const clearFolderInput = () => {
  folderName.val('');
};

const clearUrlInputs = () => {
  description.val('');
  longUrl.val('');
};

const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map(folder =>
      addFolderToDom(folder),
    ));
};

const addFolders = () => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      folder_name: folderName.val(),
    }),
  })
    .then(response => response.json())
    .then((folder) => {
      if (!folder.error) {
        addFolderToDom(folder);
      }
    });
};

const getFolderUrls = (id) => {
  fetch(`/api/v1/folders/${id}/urls`)
    .then(response => response.json())
    .then((urls) => {
      if (!urls.length) {
        $('.header-form-wrapper').append(
          `<h3 class='no-urls'>Links haven't been added to this folder yet</h3>`
        );
      }
      urls.map(url =>
        addUrlToDom(url),
      );
    });
};

const addUrl = () => {
  fetch(`/api/v1/folders/${dropDown.val()}/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url_title: description.val(),
      long_url: longUrl.val(),
    }),
  })
    .then(response => response.json())
    .then((url) => {
      addUrlToDom(url);
    });
};

// Setup on page load //

getFolders();

submitFolder.click((e) => {
  e.preventDefault();
  addFolders();
  clearFolderInput();
});

dropDown.change((e) => {
  e.preventDefault();
  console.log(dropDown.val());
  $(getFolderUrls(dropDown.val())).replaceAll('.url-viewer');
});

submitUrl.click((e) => {
  e.preventDefault();
  addUrl();
  clearUrlInputs();
  console.log('triggerd AF');
});

folderName.on('keyup', () => {
  const regex = new RegExp('^[a-zA-Z0-9]*[^ ]*$');
  if (!regex.test(folderName.val()) || folderName.val() === '') {
    $('.submit-folder').prop('disabled', true);
  } else {
    $('.submit-folder').prop('disabled', false);
  }
});

$('input[type=text]').on('keyup', () => {
  const urlRegex = new RegExp('^(http:\/\/|https:\/\/)+[a-zA-Z0-9]*[^ ]*$');


})
