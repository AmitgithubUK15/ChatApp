/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        "1740px":"1740px"
      },
      screens:{
        "full":"2992px",
        "2xl":"1989px",
        "2.5xl":"1900px",
        "3xl":"1800px",
         "1xl":"1700px",
         "1.5xl":"1600px",
         "xl":"1500px",
         "2lg":"1400px",
         "1lg":"1300px",
          "sm_lg":"1200px",
         "lg":"1100px", 
         "1md":"1000px",
          "2md":"900px",
          "md":"800px",
         "sm":"600px",
          "xs":"400px",
      }
    },
  },
  plugins: [],
}

