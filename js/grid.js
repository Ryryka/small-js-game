(function( global ) {
    "use strict";
  
    function Cell( config ) {
      this.$el = config.$element;
      this.x = config.x;
      this.y = config.y;
    }
  
    function Grid( config ) {
      this.grid = [];
      this.cells = [];
      this.rowsCount = config.rows;
      this.colsCount = config.cols;
      this.rows = [];
      this.cols = [];
      if (config.render) {
        this.placeholder = config.render.placeholder;
        this.render();
      }
    }
    Grid.prototype = {
      createCell: function( config ) {
        return new Cell(config);
      },
      getCellAt: function( x, y ) {
        if (!this.grid[y]) {
          console.warn("No such Y coordinate: %i (grid size is: x[%i], y[%i])", y, this.colsCount, this.rowsCount);
          return false;
        }
        if (!this.grid[y][x]) {
          console.warn("No such X coordinate: %i (grid size is: x[%i], y[%i])", x, this.colsCount, this.rowsCount);
          return false;
        }
        return this.grid[y][x];
      },
      render: function( options ) {
        if (options && options.placeholder) {
          this.placeholder = options.placeholder;
        }
        this.$placeholder = $(this.placeholder);
        if (!this.placeholder || this.$placeholder.length === 0) {
          console.error('Placeholder is not present');
          return;
        }
        var i, j, $row, $cell, cell, cellId = 0;
        for (i = 0; i < this.rowsCount; i += 1) {
          this.grid[i] = [];
          $row = $('<div class="row"></div>').prependTo(this.$placeholder);
          for (j = 0; j < this.colsCount; j += 1) {
            $cell = $('<div class="cell"></div>').appendTo($row);
            cell = this.createCell({$element: $cell, x: j, y: i});
            this.grid[i].push(cell);
            this.cells.push(cell);
          }
        }
        // rows
        var self = this;
        this.grid.forEach(function( row ) {
          self.rows.push(row);
        });
      }
    };
  
    global.Grid = Grid;
    
  }( window ));

  (function () {
    "use strict";
    setTimeout(()=>{
        let cells = document.querySelectorAll(".cell"); 
        let opacity = 0.01;
        let shapes = ['\u2660', '\u2661', '\u2662', '\u2663'];

        // filling cells with random suits
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = shapes[Math.floor(Math.random() * (4 - 0))];
        }

        // add EventListener
        cells.forEach((cell)=>{       
            cell.addEventListener("click", select);
        })    

        function checkLeft(index, parent){
            if((index % 6 != 0) 
                && (cells[index].textContent == cells[index-1].textContent)
                && (index-1 != parent) 
                && (cells[index-1].style.opacity != opacity)){
                return true;
            }
            return false;
        }

        function checkRight(index, parent){
            if(((index + 6 )% 6 != 5) 
                && (index != cells.length-1)
                && (cells[index].textContent == cells[index+1].textContent) 
                && (index+1 != parent) 
                && (cells[index+1].style.opacity != opacity)){
                return true;
            }
            return false;
        }

        function checkTop(index, parent){
            if((cells[index+6] <= cells[cells.length-1]) 
                && (cells[index].textContent == cells[index+6].textContent) 
                && (index+6 != parent) 
                && (cells[index+6].style.opacity != opacity)){
                return true;
            }
            return false;
        }

        function checkBottom(index, parent){
            if((cells[index-6] >= cells[0]) 
                && (cells[index].textContent == cells[index-6].textContent) 
                && (index-6 != parent) 
                && (cells[index-6].style.opacity != opacity)){
                return true;
            }
            return false;
        }
        function checkCell(index, parent){

            if(checkLeft(index, parent)){                
                    cells[index].style.opacity = opacity;
                    cells[index-1].style.opacity = opacity;
                    checkCell(index-1, index);             
            } 

            if(checkRight(index, parent)){
                    cells[index].style.opacity = opacity;
                    cells[index+1].style.opacity = opacity;
                    checkCell(index+1, index);
            } 

            if(checkTop(index, parent)){
                    cells[index].style.opacity = opacity;
                    cells[index+6].style.opacity = opacity;
                    checkCell(index+6, index);
            }  
            if(checkBottom(index, parent)){
                    cells[index].style.opacity = opacity;
                    cells[index-6].style.opacity = opacity;
                    checkCell(index-6, index);
            }            
        }

        function select(){     
            let el = event.target;  
            let cellsArr = Array.from(cells);        
            let currentCell = cellsArr.indexOf(el);      
        
            checkCell(currentCell, currentCell)      
        }   
    }, 1)
})()