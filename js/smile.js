    'use strict';

    class Canvas
    {
      constructor(width, height){
        this.width = width;
        this.height = height;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        // this.renderer.setClearColor(0x00EDFF, 1.0);
        this.renderer.setSize(this.width, this.height);
        this.camera.position.z = 1000;
        this.raycaster = new THREE.Raycaster();
      }

      update(width, height){
        this.width = width;
        this.height = height;

        this.renderer.setSize(this.width, this.height);
        this.camera.left = (this.width / - 2);
        this.camera.right = (this.width / 2);
        this.camera.top = (this.height / 2);
        this.camera.bottom = (this.height / - 2);
        this.camera.position.z = 1000;
        this.camera.updateProjectionMatrix();
      }

      render(){
        this.renderer.render(this.scene, this.camera);
      }
    }

    class Cube
    {
      constructor(box, canvas, navigator, texture){
        // this.texture = new THREE.Texture();
        this.texture = new THREE.TextureLoader().load( 'assets/emoji.png' );
        // let loader = new THREE.ImageLoader();
        // loader.load('assets/emoji.png', function(image){
        //   this.texture.image = image;
        //   this.texture.needsUpdate = true;
        // });

        this.geometry = new THREE.SphereGeometry(box.size, box.size, box.size);
          // this.geometry = new THREE.BoxGeometry(box.size, box.size, box.size, 1, 1, 1);
          this.material = new THREE.MeshBasicMaterial({
            map: this.texture
            // color: 0x00ff00
          });

          // this.material.map = this.texture;

          this.mesh = new THREE.Mesh(this.geometry, this.material);
          // this.edges = new THREE.EdgesGeometry(this.geometry);
          // this.mesh = new THREE.LineSegments(this.edges, new THREE.LineBasicMaterial({ color: box.color }));

          this.mesh.position.x = box.position.x;
          this.mesh.position.y = box.position.y;
          this.mesh.position.z = box.position.z;

          this.canvas = canvas;
          this.navigator = navigator;

          //animation
          this.moveAnimation = false;

          this.roamX = this.navigator.randCoOrd();
          this.roamY = this.navigator.randCoOrd();

          this.ray = false;
        }

        // load(texture, materials) {
        //   this.texture = new THREE.Texture();
        //   let loader = new THREE.ImageLoader();
        //   loader.load('assets/emoji.png', function(image){
        //     texture.image = image;
        //     texture.needsUpdate = true;
        //   });
        // }

        spin(){
          this.mesh.rotation.x += 0.01;
          this.mesh.rotation.y += 0.01;
          this.mesh.rotation.z += 0.01;
        }

        roam(){
          let x = this.roamX;
          let y = this.roamY;

          let v = new THREE.Vector3(x, y, 0);

          this.spin();
          this.mesh.position.add(v);
          this.canvas.render();


          if(this.navigator.isOutOfBoundsX(this.mesh.position.x)){
            this.roamX = x = (x < 0) ? (x * -1) : (0 - x);
          }

          if(this.navigator.isOutOfBoundsY(this.mesh.position.y)){
            this.roamY = y = (y < 0) ? (y * -1) : (0 - y);
          }
        }
      }

      class Navigator{
        constructor(boundryX, boundryY, canvas){
          this.boundryX = boundryX;
          this.boundryY = boundryY;
          this.canvas = canvas;
        }

        isOutOfBoundsX(x){
          return ((x >= this.boundryX) || (x <= (0 - this.boundryX)));
        }

        isOutOfBoundsY(y){
          return ((y >= this.boundryY) || (y <= (0 - this.boundryY)));
        }

        randCoOrd(){
          let x = Math.random() * 2 + 1;
          return x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        }

        update(boundryX, boundryY) {
          this.boundryX;
          this.boundryY;
        }
      }

      //Main
      const canvas = new Canvas(window.innerWidth, window.innerHeight);
      const navigator = new Navigator(window.innerWidth / 2, window.innerHeight / 2, canvas);
      const cubes = [];

      for(var x = 0, xl = 7; x != xl; ++x){
        let cube = new Cube({
          size: 150,
          color: "white",
          position: {
            x: 0,
            y: 0,
            z: 0
          }
        },
        canvas,
        navigator
        );

        canvas.scene.add(cube.mesh);
        canvas.render();
        cubes.push(cube);
      }


      function animation(){
        for (var x = 0, xl = cubes.length; x != xl; ++x) {
          cubes[x].roam();
        }

        requestAnimationFrame(animation);
      }

      requestAnimationFrame(animation);

      window.addEventListener("resize", () => {
        canvas.update(window.innerWidth, window.innerHeight);
        navigator.update(window.innerWidth / 2, window.innerHeight / 2);
      }, false);


      document.body.appendChild(canvas.renderer.domElement);
