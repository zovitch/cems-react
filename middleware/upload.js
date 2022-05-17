exports.upload_file = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  if (req.body.path === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const path = req.body.path;

  file.mv(`${__dirname}/../client/public/${path}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    // res.json({
    //   fileName: file.name,
    //   filePath: `/uploads/${path}/${file.name}`,
    // });
  });
};
