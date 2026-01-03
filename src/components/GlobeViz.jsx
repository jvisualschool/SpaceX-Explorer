import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import * as d3 from 'd3';

const RocketMesh = () => {
    // 외부 그룹: lookAt으로 방향 제어
    const outerGroup = new THREE.Group();

    // 내부 그룹: 로켓 형태 (lookAt에 영향받지 않음)
    const innerGroup = new THREE.Group();

    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // Body - 원통형 몸체 (높이 1.5, 반지름 0.2)
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0, 0);
    innerGroup.add(body);

    // Nose - 원뿔형 코
    const noseGeo = new THREE.ConeGeometry(0.2, 0.5, 8);
    const nose = new THREE.Mesh(noseGeo, bodyMaterial);
    nose.position.set(0, 1.0, 0);
    innerGroup.add(nose);

    // Fins - 지느러미 4개
    const finGeo = new THREE.BoxGeometry(0.1, 0.4, 0.4);
    const finMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(finGeo, finMat);
        const angle = (i * Math.PI) / 2;
        fin.position.set(
            Math.cos(angle) * 0.25,
            -0.75,
            Math.sin(angle) * 0.25
        );
        fin.rotation.y = angle;
        innerGroup.add(fin);
    }

    // Flame - 강력한 3중 레이어 불꽃 (별도 그룹으로 떨림 효과용)
    const flameGroup = new THREE.Group();
    flameGroup.name = 'flameGroup';

    // 코어 (가장 밝은 흰색/노란색)
    const coreGeo = new THREE.ConeGeometry(0.08, 0.8, 8);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 1.0 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, -0.4, 0);
    core.rotation.x = Math.PI;
    flameGroup.add(core);

    // 미들 (주황색)
    const middleGeo = new THREE.ConeGeometry(0.15, 1.2, 8);
    const middleMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.85 });
    const middle = new THREE.Mesh(middleGeo, middleMat);
    middle.position.set(0, -0.6, 0);
    middle.rotation.x = Math.PI;
    flameGroup.add(middle);

    // 아우터 (빨간색 글로우)
    const outerFlameGeo = new THREE.ConeGeometry(0.22, 1.6, 8);
    const outerFlameMat = new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.5 });
    const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    outerFlame.position.set(0, -0.8, 0);
    outerFlame.rotation.x = Math.PI;
    flameGroup.add(outerFlame);

    // 불꽃 파티클 효과 (작은 구들)
    for (let i = 0; i < 8; i++) {
        const particleGeo = new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 6, 6);
        const particleMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff8800 : 0xffaa00,
            transparent: true,
            opacity: 0.5 + Math.random() * 0.4
        });
        const particle = new THREE.Mesh(particleGeo, particleMat);
        particle.position.set(
            (Math.random() - 0.5) * 0.2,
            -1.0 - Math.random() * 0.6,
            (Math.random() - 0.5) * 0.2
        );
        particle.name = 'particle';
        flameGroup.add(particle);
    }

    flameGroup.position.set(0, -0.75, 0);
    innerGroup.add(flameGroup);

    // 내부 그룹 회전: 로켓 코(+Y)가 -Z를 향하도록 (lookAt이 -Z를 타겟으로 향함)
    innerGroup.rotation.x = -Math.PI / 2;

    outerGroup.add(innerGroup);
    return outerGroup;
};

// 미션 이름 레이블 생성
const createLabel = (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 64;

    // 반투명 배경
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.roundRect(0, 0, canvas.width, canvas.height, 8);
    ctx.fill();

    // 텍스트 (풀네임 표시)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(12, 1.5, 1);
    return sprite;
};

const GlobeViz = ({ launches, onLaunchClick, speed = 1 }) => {
    const globeEl = useRef();
    const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight });
    const rocketMeshes = useRef({}); // Map launch ID to mesh
    const activationTimes = useRef({}); // Store mapping of launch ID to activation time

    useEffect(() => {
        const handleResize = () => {
            // 왼쪽 창은 70%이므로 화면 너비의 70% 사용
            setDimensions({ width: window.innerWidth * 0.7, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 크기 설정
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Create interpolated paths
    const launchPaths = useMemo(() => {
        const now = Date.now();
        return launches.map(launch => {
            if (!launch.launchpad || typeof launch.launchpad.latitude !== 'number') return null;

            // Track when this launch was first added to the selection
            if (!activationTimes.current[launch.id]) {
                activationTimes.current[launch.id] = now;
            }

            const startLat = launch.launchpad.latitude;
            const startLng = launch.launchpad.longitude;
            // Use stored destination or deterministic random
            const seed = launch.date_unix || 0;
            const destLat = startLat + (((seed % 100) / 100) * 80 - 40);
            const destLng = startLng + 120 + (((seed % 50) / 50) * 60);

            const interpolator = d3.geoInterpolate([startLng, startLat], [destLng, destLat]);

            // Generate a unique color based on launch ID or date
            const hue = (seed % 360);
            const color = `hsla(${hue}, 80%, 60%, 0.6)`; // Colors with 60% opacity

            return {
                ...launch,
                startLat, startLng,
                destLat, destLng,
                interpolator,
                color
            };
        }).filter(l => l);
    }, [launches]);

    // Clean up activation times for removed launches
    useEffect(() => {
        const activeIds = new Set(launches.map(l => l.id));
        Object.keys(activationTimes.current).forEach(id => {
            if (!activeIds.has(id)) delete activationTimes.current[id];
        });
    }, [launches]);

    // Manage Rocket Meshes
    useEffect(() => {
        if (!globeEl.current) return;
        const scene = globeEl.current.scene();

        // 1. Add new rockets
        launchPaths.forEach(launch => {
            if (!rocketMeshes.current[launch.id]) {
                const mesh = RocketMesh();
                mesh.scale.set(3.0, 3.0, 3.0);
                scene.add(mesh);

                // 미션 이름 레이블 생성
                const label = createLabel(launch.name);
                scene.add(label);

                rocketMeshes.current[launch.id] = { mesh, launch, label };
            }
        });

        // 2. Remove old rockets
        Object.keys(rocketMeshes.current).forEach(id => {
            if (!launchPaths.find(l => l.id === id)) {
                scene.remove(rocketMeshes.current[id].mesh);
                scene.remove(rocketMeshes.current[id].label);
                delete rocketMeshes.current[id];
            }
        });

    }, [launchPaths]);

    // Animation Loop
    useEffect(() => {
        let frameId;
        const animate = () => {
            const now = Date.now();

            Object.values(rocketMeshes.current).forEach(({ mesh, launch }) => {
                if (!launch || !launch.interpolator) return;

                const startTime = activationTimes.current[launch.id] || now;
                // Much slower movement - 180 seconds at speed 1
                const duration = 180000 / speed;
                const elapsed = now - startTime;
                const t = Math.min(1, Math.max(0, elapsed / duration)); // Clamp between 0 and 1

                // Get Position along the arc path - same as arc uses
                const [lng, lat] = launch.interpolator(t);
                // Use exact same altitude calculation as arc (arcAltitude = 0.5)
                const arcAltitude = 0.5; // Same as arcAltitude prop
                const altitude = arcAltitude * Math.sin(t * Math.PI); // Arc shape matching the dashed line

                // Convert to Cartesian coordinates
                const { x, y, z } = globeEl.current.getCoords(lat, lng, altitude);
                mesh.position.set(x, y, z);

                // Orientation - point in the direction of travel along the arc
                if (t < 1) {
                    // 궤도 방향을 정확히 계산하기 위해 작은 간격으로 다음 위치 계산
                    const lookAheadStep = 0.01;
                    const nextT = Math.min(1, t + lookAheadStep);
                    const [nextLng, nextLat] = launch.interpolator(nextT);
                    const nextAlt = arcAltitude * Math.sin(nextT * Math.PI);
                    const nextPos = globeEl.current.getCoords(nextLat, nextLng, nextAlt);

                    // 방향 벡터 계산
                    const dirX = nextPos.x - x;
                    const dirY = nextPos.y - y;
                    const dirZ = nextPos.z - z;
                    const distance = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

                    if (distance > 0.0001) {
                        // 로켓이 궤도를 정확히 따라가도록 lookAt 사용
                        mesh.lookAt(nextPos.x, nextPos.y, nextPos.z);
                        // 180도 회전하여 코가 진행 방향을 향하도록
                        mesh.rotateY(Math.PI);
                    }
                }

                // 레이블 위치 및 스케일 업데이트 (카메라 거리에 따라 일정한 크기 유지)
                const rocketData = rocketMeshes.current[launch.id];
                if (rocketData && rocketData.label && globeEl.current) {
                    rocketData.label.position.set(x + 5, y + 3, z);

                    // 카메라 거리에 따라 스케일 조정 (일정한 화면 크기 유지) - 200% 확대
                    const camera = globeEl.current.camera();
                    const cameraDistance = camera.position.distanceTo(rocketData.label.position);
                    const baseScale = cameraDistance * 0.08;
                    rocketData.label.scale.set(baseScale * 4, baseScale * 0.5, 1);
                }

                // 불꽃 떨림 애니메이션
                const innerGroup = mesh.children[0];
                if (innerGroup) {
                    const flameGroup = innerGroup.children.find(child => child.name === 'flameGroup');
                    if (flameGroup) {
                        // 전체 불꽃 그룹 스케일 떨림
                        const baseScale = 1.0;
                        const flickerScale = baseScale + (Math.random() - 0.5) * 0.3;
                        const flickerScaleY = baseScale + Math.random() * 0.4;
                        flameGroup.scale.set(flickerScale, flickerScaleY, flickerScale);

                        // 파티클 위치 떨림
                        flameGroup.children.forEach(child => {
                            if (child.name === 'particle') {
                                child.position.x += (Math.random() - 0.5) * 0.02;
                                child.position.z += (Math.random() - 0.5) * 0.02;
                                child.position.y -= Math.random() * 0.02;

                                // 파티클이 너무 멀리 가면 리셋
                                if (child.position.y < -1.8) {
                                    child.position.y = -1.0 - Math.random() * 0.3;
                                    child.position.x = (Math.random() - 0.5) * 0.2;
                                    child.position.z = (Math.random() - 0.5) * 0.2;
                                }
                            }
                        });
                    }
                }
            });

            frameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frameId);
    }, [speed, launchPaths]);



    return (
        <Globe
            ref={globeEl}
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"


            // Static Rings for Sites
            ringsData={[
                ...launchPaths.map(l => ({ lat: l.startLat, lng: l.startLng, color: '#3b82f6' })), // Launch
                ...launchPaths.map(l => ({ lat: l.destLat, lng: l.destLng, color: '#ef4444' }))   // Landing
            ]}
            ringColor="color"
            ringMaxRadius={5}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1000}

            // Paths (dashed lines)
            arcsData={launchPaths}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="destLat"
            arcEndLng="destLng"
            arcColor="color"
            arcDashLength={0.15} // Denser dashes
            arcDashGap={0.1}    // Tighter gaps
            arcDashAnimateTime={8000} // Much slower line movement (3000 -> 8000)
            arcAltitude={0.5}
            arcStroke={1.2} // 20% thinner (1.5 * 0.8)

            // Interactive Points (Launch Sites)
            pointsData={launchPaths}
            pointLat="startLat"
            pointLng="startLng"
            pointColor={() => '#3b82f6'}
            pointRadius={0.5}
            pointAltitude={0.005} // Reduce height by 50%

            onPointClick={(point) => onLaunchClick && onLaunchClick(point)}

            width={dimensions.width}
            height={dimensions.height}
            atmosphereColor="#3a228a"
            atmosphereAltitude={0.25}

            onGlobeReady={() => {
                if (globeEl.current) {
                    const controls = globeEl.current.controls();
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.1; // Slow rotation
                    controls.enablePan = true;
                    controls.screenSpacePanning = true;
                    // 기본 마우스 버튼 설정
                    controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
                    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
                    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;

                    // 지구를 중앙에 위치시키기 (왼쪽 창의 중앙)
                    globeEl.current.pointOfView({
                        altitude: 2.5,
                        lng: 0,  // 경도 0 (그리니치)
                        lat: 0   // 위도 0 (적도)
                    }, 0);
                }
            }}
        />
    );
};

export default GlobeViz;
