const folderName = $('.folder-input');
const dropDown = $('.dropbtn');
const submitFolder = $('.submit-folder');
const description = $('.description-input');
const longUrl = $('.url-input');
const submitUrl = $('.submit-url');

const addFolderToDom = (folder) => {
  if (folder.id !== undefined && folder.folder_name !== ' ' ) {
    dropDown.append(
      `<option value='${folder.id}'>${folder.id}: ${folder.folder_name}</option>`,
    );
  }
};

const clearFolderInput = () => {
  folderName.val('');
};

const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map(folder =>
      addFolderToDom(folder),
    ));
};

const addFolders = () => {
  const folderNameInput = folderName.val();

  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      folder_name: folderNameInput,
    }),
  })
    .then(response => response.json())
    .then((folder) => {
      console.log(folder)
      if (!folder.error && folder.folder_name !== ' ') {
        addFolderToDom(folder);
      }
    });
};

const folderSubmit = submitFolder.click((e) => {
  e.preventDefault();
  addFolders();
  clearFolderInput();
});

// Setup section

getFolders();

$('.folder-input').on('keyup', () => {
  const $name = $('.folder-input').val();
  const regex = new RegExp('^[a-zA-Z0-9]*$');
  if (!regex.test($name)) {
    $('.submit-folder').prop('disabled', true);
  } else {
    $('.submit-folder').prop('disabled', false);
  }
});
