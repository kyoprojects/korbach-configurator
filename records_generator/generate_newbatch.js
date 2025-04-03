// const fs = require('fs');
// const baseUrl = 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public';
// const config = {
//   brand: 'porsche',
//   carModel: 'taycan-turbo-s',
//   carColors: ['black', 'carmine-red', 'dolomite-silver', 'frozenberry', 'frozen-blue', 'gentian-blue', 'neptune-blue', 'oak-green', 'provence', 'purple-sky', 'red', 'vulcanic-grey', 'white'],
//   carViews: ['front', 'mid', 'rear'],
//   wheelModels: ['ps1', 'ps10', 'ps14', 'ps17', 'ps19', 'ps20', 'ps20', 'ps22', 'ps25', 'ps3', 'ps6', 'ps7', 'ps9'],
//   wheelColors: ['gloss_black', 'gloss_bronze', 'gloss_titanium', 'satin_black', 'satin_bronze', 'satin_grey']
// };
// let csv = 'car_brand,car_model,view,color,image,file_path,model,type';
// config.carViews.forEach(view => {
//   config.carColors.forEach(color => {
//     const fileName = `${config.brand}-${config.carModel}-${view}-${color}.webp`;
//     const path = `/renders/${config.brand}/${config.carModel}/car/${view}/${fileName}`;
//     csv += `\n${config.brand},${config.carModel},${view},${color},${baseUrl}${path},${path},,car`;
//   });
// });
// config.wheelModels.forEach(wheelModel => {
//   config.wheelColors.forEach(color => {
//     config.carViews.forEach(view => {
//       const fileName = `${view}_${color}_${wheelModel}.webp`;
//       const path = `/renders/${config.brand}/${config.carModel}/wheels/${wheelModel}/${view}/${fileName}`;
//       csv += `\n${config.brand},${config.carModel},${view},${color},${baseUrl}${path},${path},${wheelModel},wheel`;
//     });
//   });
// });
// fs.writeFileSync('renders.csv', csv);

const fs = require('fs');
const baseUrl = 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public';
const config = {
  brand: 'porsche',
  carModel: 'taycan-turbo-s',
  carColors: ['black', 'carmine-red', 'dolomite-silver', 'frozenberry', 'frozen-blue', 'gentian-blue', 'neptune-blue', 'oak-green', 'provence', 'purple-sky', 'red', 'vulcanic-grey', 'white'],
  carViews: ['front', 'mid', 'rear'],
  wheelModels: ['ps1', 'ps10', 'ps14', 'ps17', 'ps19', 'ps20', 'ps22', 'ps25', 'ps3', 'ps5', 'ps7', 'ps9'],
  wheelColors: ['gloss_black', 'gloss_bronze', 'gloss_titanium', 'satin_black', 'satin_bronze', 'satin_grey']
};
let csv = 'car_brand,car_model,view,color,image,file_path,model,type';
config.carViews.forEach(view => {
  config.carColors.forEach(color => {
    const fileName = `base-${view}-${color}.webp`;
    const path = `/renders/${config.brand}/${config.carModel}/car/${view}/${fileName}`;
    csv += `\n${config.brand},${config.carModel},${view},${color},${baseUrl}${path},${path},,car`;
  });
});
config.wheelModels.forEach(wheelModel => {
  config.wheelColors.forEach(color => {
    config.carViews.forEach(view => {
      const fileName = `${view}_${color}_${wheelModel}.webp`;
      const path = `/renders/${config.brand}/${config.carModel}/wheels/${wheelModel}/${view}/${fileName}`;
      csv += `\n${config.brand},${config.carModel},${view},${color},${baseUrl}${path},${path},${wheelModel},wheel`;
    });
  });
});
fs.writeFileSync('renders.csv', csv);
