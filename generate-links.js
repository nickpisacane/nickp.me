const uuid = require('uuid');
const fs = require('fs');
const md5 = require('md5');

const invitees = [
  'Susan + Victor',
  'MJ + Shawn',
  'Katy + Bob',
  'Betsy + Jim',
  'Patt + Steve',
  'Sandy + Dick',
  'Marcey',
  'Dorothy ',
  'Adrian',
  'Shawn + Rose',
  'Diana ',
  'Beth',
  'Sadie S',
  'Dustin',
  'Alexis B',
  'Corey ',
  'Jess + Ozz',
  'Dave',
  'Su W',
];

const getLink = (name, id) => {
  const json = JSON.stringify({name, id});
  const b64 = encodeURIComponent(Buffer.from(json).toString('base64'));
  return `https://nickp.me/channing-birthday-invite-2022.html?init=${b64}`;
};

const main = () => {
  // console.log('Nick: ', getLink('Nick Test', uuid.v4()));
  // console.log('Kath: ', getLink('Kathy Test', uuid.v4()));
  let buf = '';
  invitees.forEach((name) => {
    const id = md5(name);
    const link = getLink(name, id);
    console.log(`${name}: ${link}`);
    buf += `${link}\n`;
  });

  fs.writeFileSync('copy_csv_invites.csv', buf);
};

main();
