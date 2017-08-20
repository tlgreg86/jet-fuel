
const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map(folder => {
      $('.dropbtn').prepend
      (`<option value='${folder.id}'>${folder.folder_name}</option>`)
    }))
}
// getFolders();

const addFolders = () => {
  const folderNameInput = $('.folder-input').val();

  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      folderNameInput,
    }),
  })
    .then(response => response.json())
    .then(folder => {

    })

}
