const db = require('better-sqlite3')(
  '/Users/bas/Pictures/Photos Library.photoslibrary/database/photos.sqlite', 
  // { verbose: console.log }
);
var osa = require('osa2')

function getSelectedPhotoId() {

  return osa(() => {
    const app = Application("Photos");
    const selectedPhotoId = app.selection()[0].id();

    return selectedPhotoId;
  })()
}

getSelectedPhotoId()
  .then(selectedPhotoId => {
    const slashIndex = selectedPhotoId.indexOf("/");
    const rootId = selectedPhotoId.substring(0, slashIndex);

    // console.log(rootId);

    let i = 0;
    const statement = db.prepare(`
    SELECT ZADDITIONALASSETATTRIBUTES.Z_PK as pkAdd, 
           ZASSET.Z_PK as pkAss,
           ZORIGINALFILENAME as filename, 
           ZGENERICALBUM.ZTITLE as albumTitle, 
           ZALTERNATEIMPORTIMAGEDATE as fileCreatedDate, 
           ZASSET.ZDATECREATED as date, 
           ZGENERICALBUM.ZTITLE, 
           ZASSET.ZKIND, 
           ZASSET.ZDURATION, 
           ZASSET.ZUNIFORMTYPEIDENTIFIER as videoType,
           ZASSET.ZUUID as id
    FROM ZADDITIONALASSETATTRIBUTES
    INNER JOIN ZASSET
    ON ZADDITIONALASSETATTRIBUTES.Z_PK = ZASSET.ZADDITIONALATTRIBUTES
    INNER JOIN Z_27ASSETS
    ON ZASSET.Z_PK = Z_27ASSETS.Z_3ASSETS
    INNER JOIN ZGENERICALBUM
    ON Z_27ASSETS.Z_27ALBUMS = ZGENERICALBUM.Z_PK
    WHERE ZASSET.ZUUID = '${rootId}'
    `);

    for (const row of statement.iterate()) {
      // console.log(i++ + "\t" + row.pkAss + "\t" + row.pkAdd + "\t" + row.filename + "\t" + row.albumTitle + "\t" + row.fileCreatedDate + "\t" + row.date + "\t" + row.videoType + "\t" + row.id);
      console.log(i++ + "\t" + row.albumTitle);
    }

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  });
