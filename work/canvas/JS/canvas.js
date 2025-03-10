/*
Andrew Whitehead (Student Number: 400581822)
Hansen Cheng (Student Number: 400579195)
Feb 27, 2025
JavaScript code controlling interactions with a simple canvas drawing program
*/

// Wait for page to fully load to run anything
window.addEventListener("load", function (event) {

    // Toggle whether user can place shapes
    let placeMode = false;

    // Track what shape is active
    let userSquare = false;
    let userCircle = false;
    let userTriangle = false;
    let userRectangle = false;

    // Holds the id of the timer
    let timerId;

    let c = document.getElementById("animationCanvas");
    let ctx = c.getContext("2d");

    class Square {
        constructor(x, y, w, c, t, n) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.c = c;
            this.t = t;
            this.n = n;
        }

        draw() {
            ctx.strokeStyle = this.c;
            ctx.lineWidth = this.t;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.w, this.y);
            ctx.lineTo(this.x + this.w, this.y + this.w);
            ctx.lineTo(this.x, this.y + this.w);
            ctx.closePath();
            ctx.stroke();
        }
    }

    class Circle {
        constructor(x, y, r, c, t, n) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.c = c;
            this.t = t;
            this.n = n;
        }

        draw() {
            ctx.strokeStyle = this.c;
            ctx.lineWidth = this.t;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
    }

    class Triangle {
        constructor(x, y, l, c, t, n) {
            this.x = x;
            this.y = y;
            this.l = l;
            this.c = c;
            this.t = t;
            this.n = n;
        }

        draw() {
            ctx.strokeStyle = this.c;
            ctx.lineWidth = this.t;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + (this.l / 2), this.y - this.l);
            ctx.lineTo(this.x + this.l, this.y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    class Rectangle {
        constructor(x, y, h, c, t, n) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.c = c;
            this.t = t;
            this.n = n;
        }

        draw() {
            ctx.strokeStyle = this.c;
            ctx.lineWidth = this.t;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + (this.h * 2), this.y);
            ctx.lineTo(this.x + (this.h * 2), this.y + this.h);
            ctx.lineTo(this.x, this.y + this.h);
            ctx.closePath();
            ctx.stroke();
        }
    }

    // Help users see where the shape will be placed
    let tracer;

    // Initialize array to store user shapes
    // If user abandoned earlier drawing, retrieve it from local storage
    let oldshapes = [];
    let shapes = [];
    if (localStorage.shapes) {
        oldshapes = JSON.parse(localStorage.shapes);

        for (let shape of oldshapes) {
            if (shape.n == "square") {
                shape = new Square (shape.x, shape.y, shape.w, shape.c, shape.t, shape.n);
                shapes.push(shape);
            }
            else if (shape.n == "circle") {
                shape = new Circle (shape.x, shape.y, shape.r, shape.c, shape.t, shape.n);
                shapes.push(shape);
            }
            else if (shape.n == "triangle") {
                shape = new Triangle (shape.x, shape.y, shape.l, shape.c, shape.t, shape.n);
                shapes.push(shape);
            }
            else {
                shape = new Rectangle (shape.x, shape.y, shape.h, shape.c, shape.t, shape.n);
                shapes.push(shape);
            }
        }
    }

    // Starts the update function
    // 16  milliseconds works out to 62.5 frames per second
    // No input or return values
    function startDrawing() {
        timerId = setInterval(updateDrawing, 16);
    }

    // Constantly resets the canvas and redraws shapes
    // Initiated by startDrawing()
    function updateDrawing() {

        // Clear the canvas
        ctx.clearRect(0, 0, c.width, c.height);

        if (placeMode) {
            if ((userSquare) || (userCircle) || (userTriangle) || (userRectangle)) {
                tracer.draw();
            }
        }
        
        for (let shape of shapes) {
            shape.draw();
        }
    }

    // Creates a new shape on the canvas on user click and adds to shapes array
    // Applies properties based on values of the input fields like color
    // Overwrites localStorage with the modified shapes array
    function create(event) {
        let shapeCol = document.getElementById("color").value;
        let shapeThick = document.getElementById("thickness").value;
        let shapeLength = parseInt(document.getElementById("length").value);
    
        let rect = c.getBoundingClientRect();
        
        // Fix: Calculate scale factor
        let scaleX = c.width / rect.width;
        let scaleY = c.height / rect.height;
    
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;
    
        if (userSquare) {
            let square = new Square(x - (shapeLength / 2), y - (shapeLength / 2), shapeLength, shapeCol, shapeThick, "square");
            shapes.push(square);
        }
        else if (userCircle) {
            let circle = new Circle(x, y, shapeLength, shapeCol, shapeThick, "circle");
            shapes.push(circle);
        }
        else if (userTriangle) {
            let triangle = new Triangle(x - (shapeLength / 2), y + ((shapeLength * 3) / 10), shapeLength, shapeCol, shapeThick, "triangle");
            shapes.push(triangle);
        }
        else if (userRectangle) {
            let rectangle = new Rectangle(x - shapeLength, y - shapeLength, shapeLength, shapeCol, shapeThick, "rectangle");
            shapes.push(rectangle);
        }
        localStorage.shapes = JSON.stringify(shapes);
    }

    // Used to update the cursor tracer to the current shape
    // Occurs based on a user clicking on one of the 4 possible shape inputs
    // Sets the corresponding user<shape> variable to true to track current shape selection
    function shapeChange(event) {
        let square = document.getElementById("menusquare");
        let circle = document.getElementById("menucircle");
        let triangle = document.getElementById("menutriangle");
        let rectangle = document.getElementById("menurectangle");
        let thick = document.getElementById("thickness").value;
        let length = document.getElementById("length").value;
        let color = document.getElementById("color").value;
        length = parseInt(length);

        if (this.id == 'menusquare') {
            tracer = new Square (-300, -300, length, color, thick, "square");
            userSquare = true;
            userCircle = false;
            userTriangle = false;
            userRectangle = false;
            this.classList.add("selected");
            circle.classList.remove("selected");
            triangle.classList.remove("selected");
            rectangle.classList.remove("selected");
        }
        else if (this.id == 'menucircle') {
            tracer = new Circle (-300, -300, length, color, thick, "circle");
            userSquare = false;
            userCircle = true;
            userTriangle = false;
            userRectangle = false;
            this.classList.add("selected");
            square.classList.remove("selected");
            triangle.classList.remove("selected");
            rectangle.classList.remove("selected");
        }
        else if (this.id == 'menutriangle') {
            tracer = new Triangle (-300, -300, length, color, thick, "triangle");
            userSquare = false;
            userCircle = false;
            userTriangle = true;
            userRectangle = false;
            this.classList.add("selected");
            square.classList.remove("selected");
            circle.classList.remove("selected");
            rectangle.classList.remove("selected");
        }
        else {
            tracer = new Rectangle (-300, -300, length, color, thick, "rectangle");
            userSquare = false;
            userCircle = false;
            userTriangle = false;
            userRectangle = true;
            this.classList.add("selected");
            square.classList.remove("selected");
            circle.classList.remove("selected");
            triangle.classList.remove("selected");
        }
    }

    // Sets the tracer object's x,y to follow the cursor's x,y
    // Triggered based on any cursor movement within the canvas dimensions
    // Adjusts object position based on its shape for best drawing experience
    function trackTracer(event) {
        let rect = c.getBoundingClientRect();

        let scaleX = c.width / rect.width;
        let scaleY = c.height / rect.height;
    
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;
    
        if (userSquare) {
            tracer.x = x - (tracer.w / 2);
            tracer.y = y - (tracer.w / 2);
        }
        else if (userCircle) {
            tracer.x = x;
            tracer.y = y;
        }
        else if (userTriangle) {
            tracer.x = x - (tracer.l / 2);
            tracer.y = y + ((tracer.l * 3) / 10);
        }
        else if (userRectangle) {
            tracer.x = x - tracer.h;
            tracer.y = y - tracer.h;
        }
    }

    // Toggles user's ability to draw shapes on the canvas
    // If the html place button is clicked, place mode is now active
    // If the button is clicked while place mode is active, it is deactivated
    function toggleTracer(event) {
        let placeButton = document.getElementById("place");
    
        if (placeMode) {
            document.getElementById("animationCanvas").removeEventListener("click", create);
            placeMode = false;
            placeButton.classList.remove("active");
        } else {
            document.getElementById("animationCanvas").addEventListener("click", create);
            placeMode = true;
            placeButton.classList.add("active");
        }
    }

    // Updates the cursor tracer shape properties
    // Any modification to html input fields like color will trigger updateTracer()
    // Modifies all properties to account for any input change
    function updateTracer(event) {
        let thick = document.getElementById("thickness").value;
        let length = document.getElementById("length").value;
        let color = document.getElementById("color").value;
        length = parseInt(length);

        if (tracer.n == 'square') {
            tracer.w = length;
        }
        else if (tracer.n == 'circle') {
            tracer.r = length;
        }
        else if (tracer.n == 'triangle'){
            tracer.l = length;
        }
        else {
            tracer.h = length;
            console.log("through");
        }
        tracer.t = thick;
        tracer.c = color;
    }

    // Clears the canvas completely
    // Achieved by removing all objects in the shapes array
    // Triggered on an html 'clear canvas' button click
    function clear(event) {
        shapes = [];
        localStorage.shapes = JSON.stringify(shapes);
    }

    // Removes the most recently placed shape on the canvas
    // Achieved by removing the most recently added element in the shapes array
    // Triggered on an html 'undo' button click
    function undo(event) {
        shapes.pop();
        localStorage.shapes = JSON.stringify(shapes);
    }

    // Event listeners for the program
    document.getElementById("animationCanvas").addEventListener("mousemove", trackTracer);
    document.getElementById("place").addEventListener("click", toggleTracer);
    let shapeChoice = document.querySelectorAll(".shape");
    for (let shape of shapeChoice) {
        shape.addEventListener("click", shapeChange);
    }
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("thickness").addEventListener("input", updateTracer);
    document.getElementById("length").addEventListener("input", updateTracer);
    document.getElementById("color").addEventListener("input", updateTracer);

    // Start the updateDrawing() function
    startDrawing();

});