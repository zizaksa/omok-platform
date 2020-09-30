import { Application, autoDetectRenderer, Container, Graphics, Loader, Renderer, Sprite } from "pixi.js";

export class AppCanvas {
    private width: number;
    private height: number;

    private app: Application;

    private gridSize = 40;
    private boardSize = 19;
    private gridColor = 0x000;
    private flowerDotSize = 5;

    constructor (width: number, height: number) {
        this.app = new Application({ 
            width,
            height,
            backgroundColor: 0xFFFFFF,
            antialias: false,
            transparent: false,
            resolution: 1
         });
         
        this.app.stage.interactive = true;

        const loader = new Loader();
        loader
            .add("board", "assets/board_texture.jpg")
            .add("stone", "assets/stone_black.png")
            .load(() => {
            const stone = new Sprite(loader.resources["stone"].texture);
            const board = new Sprite(loader.resources["board"].texture);

            stone.width = 30
            stone.height = 30;

            this.app.stage.addChild(board);
            stone.position.set(10, 10);
            this.app.stage.addChild(stone);
            this.drawBoardGridLines();

        })
    }

    getView() {
        return this.app.view;
    }
    



    drawBoardGridLines() {
        var gridLines = new Graphics();
        gridLines.lineStyle(1, this.gridColor, 1);


        // 가로줄
        for (var y = 0; y < this.boardSize; y++) {

            gridLines.moveTo(this.gridSize, (y + 1) * this.gridSize);

            gridLines.lineTo(this.gridSize * this.boardSize, (y + 1) * this.gridSize);

        }



        // 세로줄

        for (var x = 0; x < this.boardSize; x++) {

            gridLines.moveTo((x + 1) * this.gridSize, this.gridSize);

            gridLines.lineTo((x + 1) * this.gridSize, this.gridSize * this.boardSize);

        }



        // 화점

        let centrify = n => ((n) * Math.floor(this.boardSize / 3) + Math.ceil(this.boardSize / 6)) * this.gridSize;

        for (var i = 0; i < 9; i++) {

            var flowerDot = new PIXI.Graphics();

            flowerDot.beginFill(this.gridColor);

            flowerDot.drawCircle(0, 0, this.flowerDotSize);

            flowerDot.endFill();

            flowerDot.x = centrify(i % 3);

            flowerDot.y = centrify(Math.floor(i / 3));

            gridLines.addChild(flowerDot);

        }


        const con = new Container();
        con.addChild(gridLines);
        this.app.stage.addChild(con);

    }

    private update() {
        
        this.app.render();
    }
}