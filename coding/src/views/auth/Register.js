// import React from "react";
// import Navbar from "components/Navbars/AuthNavbar.js";
// import FooterSmall from "components/Footers/FooterSmall.js";

// export default function Register() {
//   return (
//     <>
//     <Navbar transparent />
//     <main>
//         <section className="relative w-full h-full py-40 min-h-screen">
//           <div
//             className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
//             style={{
//               backgroundImage:
//                 "url(" + require("assets/img/register_bg_2.png").default + ")",
//             }}
//           ></div>

//       <div className="container mx-auto px-4 h-full">
//         <div className="flex content-center items-center justify-center h-full">
//           <div className="w-full lg:w-6/12 px-4">
//             <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
//               <div className="rounded-t mb-0 px-6 py-6">
//                 <div className="text-center mb-3">
//                   <h6 className="text-blueGray-500 text-sm font-bold">
//                     สมัครด้วย
//                   </h6>
//                 </div>
//                 <div className="btn-wrapper text-center">
                  
//                   <button
//                     className="bg-white active:bg-blueGray-50 text-blueGray-700  px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
//                     type="button"
//                   >
//                     <img
//                       alt="..."
//                       className="w-5 mr-1"
//                       src={require("assets/img/google.svg").default}
//                     />
//                     Google
//                   </button>
//                 </div>
//                 <hr className="mt-6 border-b-1 border-blueGray-300" />
//               </div>
//               <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
//                 <div className="text-blueGray-400 text-center mb-3 font-bold">
//                   <small>หรือสมัครด้วย</small>
//                 </div>
//                 <form>
//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       ชื่อจริง
//                     </label>
//                     <input
//                       type="text"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="ชื่อจริง"
//                     />
//                   </div>

//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       นามสกุล
//                     </label>
//                     <input
//                       type="text"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="นามสกุล"
//                     />
//                   </div>

//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       รหัสนิสิต
//                     </label>
//                     <input
//                       type="email"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="รหัสนิสิต"
//                     />
//                   </div>

//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       ชื่อเล่น
//                     </label>
//                     <input
//                       type="text"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="ชื่อเล่น"
//                     />
//                   </div>

//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="Email"
//                     />
//                   </div>

//                   <div className="relative w-full mb-3">
//                     <label
//                       className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                       htmlFor="grid-password"
//                     >
//                       รหัสผ่าน
//                     </label>
//                     <input
//                       type="password"
//                       className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                       placeholder="Password"
//                     />
//                   </div>

                 
//                   <div className="text-center mt-6">
//                     <button
//                       className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
//                       type="button"
//                     >
//                       สมัคร
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <FooterSmall absolute />
//         </section>
//       </main>
//     </>
//   );
// }
