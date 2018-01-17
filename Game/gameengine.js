var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var createScene = function () {

  var multiplyer = 4;
  var sizeRaw = size;
  var sizeGround = sizeRaw*multiplyer;

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    // Lights
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);


    // Need a free camera for collisions
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(sizeGround/2, 1, sizeGround/2), scene);
    camera.attachControl(canvas, true);

    //Skybox
    var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
    boxCloud.position = new BABYLON.Vector3(0, 0, 12);
    var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
    var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
    cloudMaterial.emissiveTexture = cloudProcText;
    cloudMaterial.backFaceCulling = false;
    cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    boxCloud.material = cloudMaterial;

    var ground = BABYLON.Mesh.CreatePlane("ground", sizeGround, scene);
    var roadmaterial = new BABYLON.StandardMaterial("road", scene);
    var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 5012, scene);
    roadmaterial.diffuseTexture = roadmaterialpt;
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;
    ground.material = roadmaterial;
    ground.position = new BABYLON.Vector3(5, -10, -15);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.setAbsolutePosition(sizeGround/2, 0, sizeGround/2);
    //positions



    var box1 = BABYLON.Mesh.CreateBox("crate", 4, scene);
    box1.position = new BABYLON.Vector3(0, -9, 0);
    box1.setAbsolutePosition(sizeGround/2, 1, sizeGround/2);
    box1.position.x = 2;
    box1.position.z = 2;

    var box1 = BABYLON.Mesh.CreateBox("crate", 4, scene);
    var material = new BABYLON.StandardMaterial("material", scene);
    var texture = new BABYLON.WoodProceduralTexture("texture", 1024, scene);
    material.diffuseTexture = texture;
    box1.material = material;

    box1.position = new BABYLON.Vector3(0, -9, 0);
    box1.setAbsolutePosition(sizeGround/2, 1, sizeGround/2);


    box1.material = roadmaterial;
    box1.position.x = 6;
    box1.position.z = 2;

    // Enable Collisions
    scene.collisionsEnabled = true;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    camera.speed = 0.7;
    //finally, say which mesh will be collisionable
    ground.checkCollisions = true;
    box1.checkCollisions = true;

    //createLabyrinth
    var createBox = new Array();
    var zVektor = 2;
    var xVektor = 2;
    console.log(dungeonArray);
    console.log(teststring);
    
    for(var y = 0; y < dungeonArray.lenght; y++){
      for(var x = 0; x < dungeonArray.lenght; x++){
        if(dungeonArray[y][x] == "o"){
          createBox[i] = BABYLON.Mesh.CreateBox("crate", 4, scene);
          createBox[i].position = new BABYLON.Vector3(0, -9, 0);
          createBox[i].setAbsolutePosition(sizeGround/2, 1, sizeGround/2);
          createBox[i].position.x = xVektor;
          createBox[i].position.z = zVektor;
          createBox[i].checkCollisions = true;

          xVektor = xVektor + 4;
        }
      }
      zVektor = zVektor + 4;
      xVektor = 2;
    }


    return scene;
} // End of createScene function
// -------------------------------------------------------------
// Now, call the createScene function that you just finished creating
var scene = createScene();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
   scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
   engine.resize();
});
