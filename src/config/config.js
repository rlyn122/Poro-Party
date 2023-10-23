//config object with setting for Phaser Game
export default{
    type: Phaser.AUTO,
    //game canvas dimensions
    width:800,
    height:600,
    //allows pixel art scaling
    render: {
        pixelArt: true,
    },
    scale: {
        //html element mygame as parent element for game canvas
        parent: "mygame",
        autoCenter:true
    },
    physics: {
        //built in physics system
        default: "arcade"
    },
    dom: {
        CreateContainer: true,
    },
    //specifies scenes that will be included in the game
    scene: [],
};