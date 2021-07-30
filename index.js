const sqlite3 = require('sqlite3').verbose();
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

    let db = new sqlite3.Database('/Users/bas/Pictures/Photos Library.photoslibrary/database/photos.sqlite', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the photos database.');
    });

    let i = 0;
    db.serialize(() => {
      db.each(`
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
        INNER JOIN Z_26ASSETS
        ON ZASSET.Z_PK = Z_26ASSETS.Z_3ASSETS
        INNER JOIN ZGENERICALBUM
        ON Z_26ASSETS.Z_26ALBUMS = ZGENERICALBUM.Z_PK
        WHERE ZASSET.ZUUID = "${rootId}"
        `, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          // console.log(i++ + "\t" + row.pkAss + "\t" + row.pkAdd + "\t" + row.filename + "\t" + row.albumTitle + "\t" + row.fileCreatedDate + "\t" + row.date + "\t" + row.videoType + "\t" + row.id);
          console.log(i++ + "\t" + row.albumTitle);
      });
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  });
