// barba.init({
//   transitions: [
//     {
//       name: 'opacity-transition',
//       leave(data) {
//         return gsap.to(data.current.container, {
//           opacity: 0
//         });
//       },
//       enter(data) {
//         return gsap.from(data.next.container, {
//           opacity: 0
//         });
//       }
//     }
//   ],
//   views: [
//     {
//       namespace: 'home',
//       afterEnter() {}
//     },
//     {
//       namespace: 'start',
//       afterEnter() {
//         console.log('Entered /start page - skipping home scripts.');
//       }
//     }
//   ]
// });

// // barba.hooks.after(() => {
// //   console.log('barbahooks afterasdfasdf');
// //   window.runHomePageScripts();
// // });

// console.log('barba init end');
