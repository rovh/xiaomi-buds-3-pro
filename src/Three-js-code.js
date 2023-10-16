import { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';

// import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import po
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import find_object_name from './find_object_name';

function Use_Three_js(use_canvas, canvas_name){
  
  useState(() => {
           

      let container;
      let camera, scene, renderer;
      let controls_orbit, controls_transform;
      let mixer;
      let enableSelection = false;
      let canvas;
      let width, height;
      let model;
      


      const objects_for_interection = 
      ['Case_Top', 
      'Bud_Left',
      'Bud_Right'
      ];

      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      const clock = new THREE.Clock();
      let action = NaN;
      let action_1, action_2, action_3;

      init();

      animate()

      function init() {

        // Render

        if (use_canvas){
          canvas = document.querySelector('#' + canvas_name)

          renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
          width = canvas.clientWidth;
          height = canvas.clientHeight;
          renderer.setSize( width, height, false );
                
        }else
        {
          canvas = document.querySelector('#' + canvas_name)

          container = document.createElement( 'div' );
          document.body.appendChild( container );

          renderer = new THREE.WebGLRenderer( { antialias: true  } );
          
          width = window.innerWidth;
          height = window.innerHeight;

          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setSize( width, height );
          
          // document.body.appendChild(renderer.domElement)
          container.appendChild(renderer.domElement)
        }

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;


        // Scene

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        // Camera

        camera = new THREE.PerspectiveCamera( 70, width / height , 0.1, 500 );

        camera.position.x = -3;
        camera.position.y = 1;
        camera.position.z = 6;

        scene.add( camera );
        
        // Lights
        
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        scene.add( ambientLight );

        const light = new THREE.DirectionalLight( 0xffffff, 3 );
        light.position.set( 0, 25, 50 );

        light.castShadow = true;
        light.shadow.camera.near = 10;
        light.shadow.camera.far = 100;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        camera.add( light );

        // Models

        const loader = new GLTFLoader();

        loader.load( '/earbuds.gltf', function ( gltf ) {

          // Model Import

          model = gltf.scene;

          // console.log(model)
          
          model.rotation.y = Math.PI

          model.traverse(function(object)
            {
              object.material = new THREE.MeshPhysicalMaterial( {
                color: new THREE.Color("hsl(100, 0%, 80%)"),
                metalness: 0.0, 
                roughness: 0.5, 
              } );

              object.castShadow = true;
              object.receiveShadow = true;
              
              // console.log(object)
            });

          // console.log(model.getObjectByName("Glass"))

          model.getObjectByName("Glass").material = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff,
            metalness: 0.25,
            roughness: 0.25,
            transmission: 1.0
          } );

          model.getObjectByName("Glass_1").material = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff,
            metalness: 0.25,
            roughness: 0.25,
            transmission: 1.0
          } );

          scene.add( model );

          // Animation

          mixer = new THREE.AnimationMixer(model)

          if (mixer)
          {
            const clips = gltf.animations;

            clips.forEach( function(clip) {
              action = mixer.clipAction(clip)
              action.paused = true;
              action.setLoop(THREE.LoopOnce);
              action.clampWhenFinished = true;
              action.timeScale = -1;
            });

            const clip_1 = THREE.AnimationClip.findByName(clips, "opening");
            action_1 = mixer.clipAction(clip_1)

            const clip_2 = THREE.AnimationClip.findByName(clips, "rotation_bud_left");
            action_2 = mixer.clipAction(clip_2)
            
            const clip_3 = THREE.AnimationClip.findByName(clips, "rotation_bud_right");
            action_3 = mixer.clipAction(clip_3)
          
          }
          

        }, undefined, function ( error ) {

          console.error( error );

        } );

        // Controls
        
        controls_orbit = new OrbitControls( camera, renderer.domElement );

        controls_orbit.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls_orbit.dampingFactor = 0.05;

        controls_orbit.minDistance = 5;
        controls_orbit.maxDistance = 25;

        

        // Events Listeners

        window.addEventListener( 'resize', onWindowResize );

        document.addEventListener( 'click', onClick );
        window.addEventListener( 'keydown', onKeyDown );
        window.addEventListener( 'keyup', onKeyUp );
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('dblclick', onDblClick);

      }

      function onDblClick(event){

          event.preventDefault();
          
          var rect = renderer.domElement.getBoundingClientRect();
          
          mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
          mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
          
          raycaster.setFromCamera( mouse, camera );

          const intersections = raycaster.intersectObjects( scene.children, true );

          if ( intersections.length > 0 ) {

          controls_transform = new TransformControls( camera, renderer.domElement )
          controls_transform.object = intersections[0]
          controls_transform.mode = 'translate'

          console.log('123412312')
        
        }
        
      }

      function onWindowResize() {
        
        if (use_canvas){

          width = canvas.clientWidth;
          height = canvas.clientHeight;
          renderer.setSize(width, height, false);
          
        }
        else
        {
          width = window.innerWidth;
          height = window.innerHeight;          
          renderer.setSize(width, height);
        }
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        render();

      }

      function onKeyDown( event ) {

        enableSelection = ( event.keyCode === 16 ) ? true : false;

      }

      function onKeyUp() {

        enableSelection = false;

      }

      function onClick( event ) {

        event.preventDefault();
        
        var rect = renderer.domElement.getBoundingClientRect();
        
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera );

        const intersections = raycaster.intersectObjects( scene.children, true );

        if ( intersections.length > 0 ) {

          let intersected_object_in_blender = find_object_name(intersections)

          function action_play(action)
          {
            if (action.paused == true)
            {

              action.paused = false;
              action.play();

              if (action.timeScale == 1)
              {
                action.timeScale = -1;
              }
              else
              {
                action.timeScale = 1;
              }
            
            }
          }

          if (intersected_object_in_blender.name == "Case_Top")
            action_play(action_1)
          if (intersected_object_in_blender.name == "Bud_Left" && action_1.timeScale == 1)
            action_play(action_2)
          if (intersected_object_in_blender.name == "Bud_Right" && action_1.timeScale == 1)
            action_play(action_3)
        
        }

        render();

      }

      function onMouseMove(event) {

        // event.preventDefault();

        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
        raycaster.setFromCamera( mouse, camera );
        var intersections = raycaster.intersectObjects( scene.children, true );
    
        if (intersections.length > 0){

          let intersected_object_in_blender = find_object_name(intersections)

          if (objects_for_interection.includes(intersected_object_in_blender.name))
          {
            document.body.style.cursor = 'pointer'
          }else{
            document.body.style.cursor = 'default'
          }

        }else{
          document.body.style.cursor = 'default'
        }
            
    }

      function animate() {

        requestAnimationFrame( animate );
        
        controls_orbit.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        // console.log(action.repetitions)

        // if (action.repetitions % 2 === 0)
        // 	{
        // 		action.stop();
        // 	}


        if(mixer)
          mixer.update(clock.getDelta());

        render();

      }

      function render() {

        renderer.render( scene, camera );

      }

  })



};

export default Use_Three_js