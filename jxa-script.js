const app = Application("Photos");

const selectedPhotoId = app.selection()[0].id();
console.log(selectedPhotoId);

for(var propertyName in app.selection()[0]) {
   console.log(propertyName);
}

const containsSelectedPhoto = album => album.mediaItems()
	.some(mediaItem => mediaItem.id() === selectedPhotoId);
	
const getAllAlbums = folder => {
	const subAlbums = folder.folders()
		.map(f => getAllAlbums(f));

	return folder.albums().concat(...subAlbums);
}

const albums = getAllAlbums(app);
albums.forEach(album => {
	if (containsSelectedPhoto(album)) {
		console.log(album.name());
	}
})