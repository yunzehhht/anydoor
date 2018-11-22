module.exports = {
	"root":true,
    "env": {
        "browser":false,
        "mocha": true,
        "node": true,
        "es6": true
	},
	"parser":"babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "script"
    },
    "rules": {
        "no-console":["error",{
            "allow":["warn","error","info"]
        }]
        // "indent": [
        //     "error",
        //     "tab"
        // ],
        // "linebreak-style": [
        //     "error",
        //     "windows"
        // ],
        // "quotes": [
        //     "error",
        //     "single"
        // ],
        // "semi": [
        //     "error",
        //     "always"
        // ]
    }
};
