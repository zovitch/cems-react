const mongoose = require('mongoose');

// Machine number is build as follow
//  F is for Floor
//  xxx is sequential
//  YY is for year

//  88F1xxx	EFD MOV Brazing Pasta Dispenser
//  88F2xxx	KOLVER Automatic Screwdriver
// 	88F3xxx	OKI Electric Soldering Iron
// 	88F4xxx	QUICK Electric Soldering Iron
// 	88F5xxx	Remote Signal Testing Box
// 	88F6xxx	Weekcode pad printing machine
// 	88F7xxx	Vent Cabinet
// 	88F8xxx	POE Testing Tool
// 	88F9xxx	METCAL Electric Soldering Iron
//
//  8FYYxxx for other standard machines

const newMachineNumber = async (req, res) => {
  const { floor, inputYear } = req;
  // Use current date or the date from the body
  let date = new Date(); //today's date
  if (inputYear) {
    date = new Date('05/05/' + inputYear.toString());
  }
  const year = date.getFullYear(); // 2021
  const year2digits = year.toString().substring(2);

  //Prepare the default Machine Number
  if (!floor) {
    res.status(400).json({ msg: 'Error: Floor information is missing' });
    return;
  }
  let newMachineNumber = '8' + floor + year2digits + '001';
  try {
    // This return an array of size 1 with the latest mmachine number
    const latestMachine = await Machine.find({
      machineNumber: { $regex: '8' + floor + year2digits, $options: 'i' },
    })
      .select('machineNumber')
      .limit(1);
    if (latestMachine[0]) {
      newMachineNumber = parseInt(latestMachine[0].machineNumber);
      newMachineNumber = newMachineNumber + 1;
    }
    return newMachineNumber;
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = newMachineNumber;
