var stage= new Kinetic.Stage({
    container:'editorContainer',
    height: 400,
    width: 640
});

var layer = new Kinetic.Layer();
var anchorLayer = new Kinetic.Layer();
var drawingLayer = new Kinetic.Layer();
var background = new Kinetic.Rect({
                    x: 0, 
                    y: 0, 
                    width: stage.getWidth(),
                    height: stage.getHeight(),
                    fill: "black"
                });

var line = new Kinetic.Line({
    points: [0,0],
    stroke: "red"
});
var box;
layer.add(background);
//layer.add(line);
drawingLayer.add(line);
stage.add(layer);
stage.add(drawingLayer);
stage.add(anchorLayer);

moving = false;
var i = 0;

var selectedObject = null;
stage.on("mousedown", function(event){
        line.getPoints()[i].x = event.x;
        line.getPoints()[i].y = event.y;
        line.getPoints().push({'x':event.x, 'y': event.y});

        box = new Kinetic.Rect({
           x: line.getPoints()[i+1].x - 5,
           y: line.getPoints()[i+1].y - 5,
           width: 10,
           height: 10,
           fill: 'green'
        });
        
        drawingLayer.add(box);
        if(i===0){
            box.on("mousedown", finish);
        }
        moving = true;  
        drawingLayer.draw();  
    i++;

});

stage.on("mousemove", function(event){
    if (moving) {
        line.getPoints()[i].x = event.x;
        line.getPoints()[i].y = event.y;
        moving = true;
        drawingLayer.drawScene();
    }
});

//stage.on("mouseup", function(){
//    //moving = false; 
//  line = new Kinetic.Line({
//    points: [line.getPoints()[1].x, line.getPoints()[1].y, line.getPoints()[1].x, line.getPoints()[1].y],
//    stroke: "red"
//    });
//   layer.add(line);
//   moving=true;
//});
var poly;

function finish(){
    stage.off("mousemove");
    stage.off("mousedown");
    poly = new Kinetic.Polygon({
        points:line.getPoints().slice(0, line.getPoints().length - 1),
        fill:"red",
        draggable:false
    });
    line.remove();
    layer.add(poly);
    drawingLayer.clear();
    poly.on('selected', selected);
    poly.on('click', function() {
        this.fire('selected');
    }).fire('selected');
    layer.draw();
}

function selected(){
    selectedObject = this;
    var points = this.attrs.points;
    var selectionPoint = null;
    var cnt = 0;
    points.forEach(function(point) {
        selectionPoint = new Kinetic.Rect({
        x: point.x - 5,
        y: point.y - 5,
        index: cnt++,
        width: 10,
        height: 10,
        fill: 'green',
        draggable:true
        });
        selectionPoint.on('dragmove', resizePoly);
        anchorLayer.add(selectionPoint);
    });
    anchorLayer.draw();
}

stage.on('click', function(event){
    if(selectedObject && event.targetNode.className !== "Polygon") {
        selectedObject = null;
        anchorLayer.removeChildren();
        anchorLayer.drawScene();
    }
});

function resizePoly(evt) {
    console.log(this, evt, selectedObject);
    var index = this.attrs.index;
    selectedObject.attrs.points[index].x = this.attrs.x + 5;
    selectedObject.attrs.points[index].y = this.attrs.y + 5;
    layer.drawScene();
}