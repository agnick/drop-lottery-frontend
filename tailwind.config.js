module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            'lgst': {'max': '1300px'},
            'lg': {'max': '992px'},
            'md': {'max': '768px'},
            'sm': {'max': '550px'},
            'sml': {'max': '430px'},
        },
        container: {
            padding: '50px',
            center: true
        },
        fontFamily: {
            'whyteInktrap': ['Whyte Inktrap', 'serif']
        },
        extend: {
            colors: {
                'misty-rose': '#FFDEDE',
                'light-coral': '#F0827D',
                'light-brown': '#A62525',
                'sweet-pink': '#F39B97'
            },
            backgroundImage: {
                'rose-gradient': 'linear-gradient(225.16deg, #FFDEDE -0.01%, #F0827D 80.72%)',
                'coral-gradient': 'conic-gradient(from 219.52deg at 62.35% 37.19%, #F0827D 0deg, #A62525 360deg);'
            }
        },
    },
    plugins: [
        require("@tailwindcss/forms")
    ],
}
