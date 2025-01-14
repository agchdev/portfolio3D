import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../App.css';

// useRef para almacenar la referencia al canvas
// useEffect para configurar la escena
const ThreeScene = () => {
    const mountRef = useRef(null); // Referencia al canvas del componente
    let isUserInteracting = false; // Bandera para detectar interacción del usuario
    let rotationVelocity = 0; // Velocidad de rotación

    useEffect(() => {

        // ORDEN DE EJECUCIÓN
        // 1. Configurar la escena
        //     1.1. Configurar la cámara
        //     1.2. Configurar el renderizador
        //     1.3. Configurar la iluminación
        // 2. Cargar el modelo 3D
        // 3. Renderizar la escena
        // Aplicar el fondo generado

        // Crear la escena
        const scene = new THREE.Scene();

        // Crear la cámara
        const camera = new THREE.PerspectiveCamera(
            75, // Ángulo de visión
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Znear -> Distancia mínima de la cámara
            1000 // Zfar -> Distancia máxima de la cámara
        );
        camera.position.set(.2, .5, 0); // Posición de la cámara
        // rotar la cámara -90 grados
        // camera.rotation.y = Math.PI / 2;

        // Crear el renderizador
        const renderer = new THREE.WebGLRenderer({ antialias: true }); // Crear el renderizador
        renderer.setClearColor(0x000000, 0); // Color de fondo transparente
        //  canvasRef.current -> Referencia al canvas del componente
        renderer.setSize(window.innerWidth, window.innerHeight); // Tamaño del canvas
        mountRef.current.appendChild(renderer.domElement); // Agregar el canvas al DOM
        // mountRef -> Referencia al contenedor del componente

        // Añadir iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiental
        scene.add(ambientLight); // Agregar la luz ambiental a la escena

        const pointLight = new THREE.PointLight(0xffffff, 10); // Luz puntual
        //Agregar radio de la luz
        pointLight.distance = 30; // Distancia de la luz
        pointLight.position.set(1, .2, 0); // Posición de la luz puntual
        scene.add(pointLight); // Agregar la luz puntual a la escena

        // Agregar otra luz puntual
        const pointLight2 = new THREE.PointLight(0xffffff, 10); // Luz puntual
        //Agregar radio de la luz
        // pointLight2.distance = 30;
        //Posicionar delante del ordenador
        pointLight2.position.set(-3, .2, 0); // Posición de la luz puntual
        scene.add(pointLight2); // Agregar la luz puntual a la escena

        // Configurar OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Suaviza el movimiento
        controls.dampingFactor = 0.02; // Factor de suavizado
        controls.minDistance = 0; // Distancia mínima del zoom
        controls.enablePan = false; // Deshabilitar el paneo con el botón derecho
        controls.autoRotate = true; // Activar auto-rotación por defecto
        controls.autoRotateSpeed = 0.5; // Velocidad baja para un efecto suave

        controls.minDistance = .5; // Distancia mínima
        controls.maxDistance = .7; // Distancia máxima

        // Limitar la rotación horizontal (azimut) 0 a 180 grados
        controls.minAzimuthAngle = 0;
        controls.maxAzimuthAngle = Math.PI;

        // Limitar la rotación horizontal (azimut) -30 a 30 grados
        controls.minPolarAngle = Math.PI / 2.5; // 30 grados
        controls.maxPolarAngle = Math.PI / 2; // 90 grados

        // Cargar el modelo 3D
        const loader = new GLTFLoader(); // Cargar el modelo
        let keyboardModel, mouseModel, screenModel, screenMesh;

        ///////////////////////////////////////// COSAS AÑADIDAS POR MI /////////////////////////////////
        const canvasWidth = 2048; // Puedes ajustar esta resolución
        const canvasHeight = 2048;
        // Crear el canvas dinamico de la pantalla
        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Crear textura a partir del canvas
        const texture = new THREE.CanvasTexture(canvas);

        const buttons = [
            { x: 50, y: 300, width: 200, height: 50, label: 'Botón 1' },
            { x: 300, y: 300, width: 200, height: 50, label: 'Botón 2' },
            { x: 550, y: 300, width: 200, height: 50, label: 'Botón 3' },
        ];

        // Función para dibujar la pantalla
        const drawCanvasContent = () => {
            // Fondo del canvas
            ctx.fillStyle = 'white'; // Color de fondo
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dibujar texto principal
            ctx.fillStyle = 'red';
            ctx.font = '120px Arial';
            ctx.fillText('KIRA te amo!', 150, 250);

            // Dibujar botones
            buttons.forEach(button => {
                ctx.fillStyle = 'blue'; // Color de fondo del botón
                ctx.fillRect(button.x, button.y, button.width, button.height);

                ctx.fillStyle = 'white'; // Color del texto
                ctx.font = '20px Arial';
                ctx.fillText(button.label, button.x + 50, button.y + 30); // Centrar texto
            });

            // Actualizar la textura del canvas
            texture.needsUpdate = true;
        };

        drawCanvasContent();
        ////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////// ZONA DE PRUEBAS ////////////////////////////////
        // const planeGeometry = new THREE.PlaneGeometry(.5,.5); // Dimensiones del plano
        // const planeMaterial = new THREE.MeshStandardMaterial({
        //     color: 0x808080, // Color gris
        //     side: THREE.DoubleSide, // Renderizar ambas caras del plano
        // });
        // const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // scene.add(plane);

        // plane.rotation.z = Math.PI / 2; // Rotar el plano para que sea horizontal
        // plane.rotation.x = -Math.PI / 2; // Rotar el plano para que sea horizontal
        // plane.rotation.y = Math.PI / 2; // Rotar el plano para que sea horizontal
        // plane.position.set(0, 0, 0);
        // plane.material = new THREE.MeshBasicMaterial({ map: texture });
        /////////////////////////////////////////////////////////////////////////////////

        loader.load('/models/keyboard.glb', function (gltf) {
            keyboardModel = gltf.scene; // Obtener la escena del modelo
            keyboardModel.position.set(0, -.2, 0); // Ajusta la posición
            scene.add(keyboardModel); // Agregar el modelo a la escena

            // Recorrer y loguear todos los nombres de los objetos en el modelo
            keyboardModel.traverse((child) => {
                if (child.isMesh) {
                    console.log('Objeto:', child.name); // Loguea el nombre de cada objeto
                }
            });
        });

        // Función para animar una tecla
        const animateKey = (keyName) => {
            console.log(keyName);
            if (keyboardModel) {
                const keyObject = keyboardModel.getObjectByName(keyName); // Asegúrate de que el nombre coincide
                if (keyObject) {
                    keyObject.position.y -= 0.002; // Baja la tecla
                    setTimeout(() => {
                        keyObject.position.y += 0.002; // Regresa a su posición original
                    }, 150); // Duración de la animación
                }
            }
        };

        // Evento de teclado para detectar teclas presionadas
        const handleKeyDown = (event) => {
            const keyName = `${event.key}`; // Convierte a formato como 'Key_A', 'Key_B', etc.
            animateKey(keyName);
        };

        window.addEventListener('keydown', handleKeyDown);

        loader.load('/models/mouse.glb', (gltf) => {
            mouseModel = gltf.scene; // Obtener la escena del modelo
            mouseModel.position.set(1, -.2, 0); // Ajusta la posición
            scene.add(mouseModel); // Agregar el modelo a la escena
        });

        // Variables para capturar el movimiento del ratón
        let mouseX = 0, mouseZ = 0;

        const handleMouseMove = (event) => {
            mouseZ = -(event.clientX / window.innerWidth) * 2 + 1; // Invertir el signo
            mouseX = (event.clientY / window.innerHeight) * 2 - 2; // Invertir el signo
        };

        window.addEventListener('mousemove', handleMouseMove);

        loader.load('/models/screen.glb', (gltf) => {
            screenModel = gltf.scene; // Obtener la escena del modelo
            screenMesh = screenModel.getObjectByName('Screen'); // Ajusta el nombre según tu modelo
            if (screenMesh) {
                screenMesh.material = new THREE.MeshBasicMaterial({ map: texture });
            }
            screenModel.position.set(0, -.2, 0); // Ajusta la posición
            scene.add(screenModel); // Agregar el modelo a la escena
        });

        ///////////////////////////////////////// COSAS AÑADIDAS POR MI /////////////////////////////////
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        canvas.addEventListener('click', (event) => {
            // Convertir las coordenadas del clic a coordenadas normalizadas
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Actualizar el raycaster
            raycaster.setFromCamera(mouse, camera);

            // Detectar intersecciones con el modelo de la pantalla
            const intersects = raycaster.intersectObjects(screenMesh); // Cambia esto si tienes más objetos
            if (intersects.length > 0) {
                console.log('¡Hiciste clic en la pantalla!');
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////

        // Actualizar contenido dinámico en el canvas
        // setInterval(() => {
        //     ctx.fillStyle = 'black';
        //     ctx.fillRect(0, 0, canvas.width, canvas.height);
        //     ctx.fillStyle = 'lime';
        //     ctx.fillText(
        //         'Actualizado!',  // Contenido dinámico
        //         50, // Posición horizontal
        //         150 // Posición vertical
        //     );
        //     texture.needsUpdate = true; // Actualizar la textura
        // }, 3000); // Cambia el contenido cada 3 segundos

        // Manejar interacción del usuario
        renderer.domElement.addEventListener('pointerdown', () => {
            isUserInteracting = true;
            rotationVelocity = 0; // Reiniciar velocidad de rotación
        });

        renderer.domElement.addEventListener('pointerup', () => {
            isUserInteracting = false;
        });

        // Simular inercia al soltar el mouse
        const applyInertia = () => {
            if (!isUserInteracting) {
                rotationVelocity *= 0.95; // Reducir gradualmente la velocidad
                controls.autoRotate = true; // Activa la rotación automática basada en la inercia
                controls.autoRotateSpeed = rotationVelocity;
            }
        };

        // Animación del renderizado
        const animate = () => {
            requestAnimationFrame(animate); // Llamada recursiva -> Repetir la animación

            // Actualizar la velocidad de rotación
            if (!isUserInteracting) applyInertia(); // Simular inercia

            // Mover el ratón 3D según la posición del cursor
            if (mouseModel) {
                // Mover el ratón 3D
                mouseModel.position.x = mouseX * .1; // Ajusta la sensibilidad en X
                mouseModel.position.z = mouseZ * .1; // Ajusta la sensibilidad en Y
            }
            controls.update();
            renderer.render(scene, camera); // Renderizar la escena
        };
        // Iniciar la animación
        animate();

        // Manejar redimensionamiento
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight; // Actualizar el aspect ratio de la cámara
            camera.updateProjectionMatrix(); // Actualizar la matriz de proyección
            renderer.setSize(window.innerWidth, window.innerHeight); // Actualizar el tamaño del canvas
        };
        // Escuchar el evento de redimensionamiento
        window.addEventListener('resize', handleResize);

        return () => {
            mountRef.current.removeChild(renderer.domElement); // Eliminar el canvas del DOM
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }}>
            </div>
            <div className='noise'></div>
        </>
    );
};

export default ThreeScene;