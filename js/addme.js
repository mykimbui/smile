window.addEventListener("click", addCube, false);

function addCube(){
  var geometry = new THREE.CubeGeometry( 200, 200, 200 );
  var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  var mesh = new THREE.Mesh( geometry, material );
  //scene is global
  scene.add(mesh);
}
