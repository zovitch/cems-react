exports.upload_file = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(
    `${__dirname}/../client/public/uploads/machines/${file.name}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({
        fileName: file.name,
        filePath: `/uploads/machines/${file.name}`,
      });
    }
  );
};

//https://morioh.com/p/ffd9b4fb610a
//https://stackoverflow.com/questions/67232312/uploading-file-that-already-exists-is-causing-page-to-refresh
