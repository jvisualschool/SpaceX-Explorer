import React, { useState, useEffect } from 'react';
import { X, Loader, Rocket, Info, Languages, Search, Image as ImageIcon, Youtube, MapPin, CheckCircle2, XCircle, ZoomIn, Star, ExternalLink } from 'lucide-react';
import GlobeViz from './components/GlobeViz';
import { fetchRecentLaunches } from './api/spacex';
import { getMissionPatchUrl } from './utils/missionPatches';
import { getMissionVideoId, getMissionTrajectoryImage, getMissionOfficialWebsite } from './utils/missionData';

// Translation object
const translations = {
  ko: {
    title: 'SpaceX 추적기',
    subtitle: '실시간 궤도 & 착륙 지역',
    loading: 'SpaceX 미션 로딩 중...',
    simulationControl: '시뮬레이션 제어',
    speed: '속도',
    missions: '미션',
    selectAll: '전체 선택',
    deselectAll: '전체 해제',
    play: '재생',
    info: '정보',
    rocket: '로켓',
    date: '날짜',
    launchpad: '발사대',
    result: '결과',
    successful: '성공',
    failed: '실패',
    payloads: '페이로드',
    close: '닫기'
  },
  en: {
    title: 'SpaceX Explorer',
    subtitle: 'Real-time Trajectories & Landing Zones',
    loading: 'Loading SpaceX Missions...',
    simulationControl: 'Simulation Control',
    speed: 'Speed',
    missions: 'Missions',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    play: 'Play',
    info: 'Info',
    rocket: 'Rocket',
    date: 'Date',
    launchpad: 'Launchpad',
    result: 'Result',
    successful: 'SUCCESSFUL',
    failed: 'FAILED',
    payloads: 'Payloads',
    close: 'Close'
  }
};

function App() {
  const [launches, setLaunches] = useState([]);
  const [selectedLaunches, setSelectedLaunches] = useState(new Set()); // IDs visible
  const [speed, setSpeed] = useState(1);
  const [modalLaunch, setModalLaunch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ko'); // Default to Korean
  const [zoomedImage, setZoomedImage] = useState(null); // For patch image zoom
  const [isSplashOpen, setIsSplashOpen] = useState(false); // For splash modal

  const t = translations[language]; // Translation helper

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setZoomedImage(null);
        setIsSplashOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRecentLaunches(50); // Increased to 50 for more data
      // Sort by date descending (newest first)
      const sortedData = data.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));

      // Debug: Log date range
      if (sortedData.length > 0) {
        console.log('Latest launch:', sortedData[0].name, new Date(sortedData[0].date_utc).toLocaleDateString());
        console.log('Oldest launch:', sortedData[sortedData.length - 1].name, new Date(sortedData[sortedData.length - 1].date_utc).toLocaleDateString());
      }

      setLaunches(sortedData);
      // Default all deselected
      setSelectedLaunches(new Set());
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleLaunch = (id) => {
    const newSet = new Set(selectedLaunches);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedLaunches(newSet);
  };

  const openModal = (launch) => {
    setModalLaunch(launch);
    setIsModalOpen(true);
  };

  // Filter launches based on selection
  const visibleLaunchesData = launches.filter(l => selectedLaunches.has(l.id));

  return (
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: '70% 30%', height: '100vh', width: '100vw' }}>
      {/* Loading Overlay */}
      {loading && (
        <div className="glass-panel" style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          padding: '2rem', zIndex: 100, display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <Loader className="animate-spin" size={24} />
          <h2>{t.loading}</h2>
        </div>
      )}

      {/* Left Section: Globe */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div className="title-overlay glass-panel">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rocket 
              size={24} 
              color="#60a5fa" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setIsSplashOpen(true)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            {t.title}
          </h1>
          <p style={{ color: '#94a3b8' }}>
            {t.subtitle}
          </p>
        </div>

        {!loading && <GlobeViz launches={visibleLaunchesData} speed={speed} onLaunchClick={openModal} />}
      </div>

      {/* Right Section: Controls */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'rgba(5, 5, 16, 0.8)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Controls: Speed & List */}
        <div className="launch-list" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t.simulationControl}</h3>
              <button
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                style={{
                  background: 'rgba(96, 165, 250, 0.2)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  borderRadius: '6px',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  padding: '0.4rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)'}
                title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                <Languages size={14} />
                {language === 'ko' ? 'EN' : 'KO'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{t.speed}: {speed}x</span>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                style={{ width: '60%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t.missions} ({launches.length})</h3>
            <button
              onClick={() => setSelectedLaunches(selectedLaunches.size === 0 ? new Set(launches.map(l => l.id)) : new Set())}
              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              {selectedLaunches.size === 0 ? t.selectAll : t.deselectAll}
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {launches.map((launch) => (
              <div
                key={launch.id}
                className={`launch-item ${modalLaunch?.id === launch.id ? 'active' : ''}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {(() => {
                      const patchInfo = getMissionPatchUrl(launch.name);
                      // Starlink 미션은 패치가 없으므로 별 표시하지 않음
                      if (patchInfo.isStarlink) {
                        return null;
                      }
                      // 모달과 동일한 로직: API 패치가 실제 패치인지 확인
                      const apiPatch = launch.links?.patch?.small;
                      const elonxPatch = patchInfo.url;
                      // API 패치가 로켓 이미지가 아닌 실제 패치인지 확인
                      const isValidPatch = apiPatch && (
                        apiPatch.toLowerCase().includes('patch') || 
                        apiPatch.toLowerCase().includes('mission_patch') ||
                        apiPatch.toLowerCase().includes('mission-patch')
                      ) && !apiPatch.includes('falcon') && !apiPatch.includes('rocket') && !apiPatch.includes('slc_image');
                      const hasPatch = (isValidPatch ? apiPatch : null) || elonxPatch;
                      return hasPatch ? (
                        <Star size={14} color="#fbbf24" fill="#fbbf24" style={{ flexShrink: 0 }} />
                      ) : null;
                    })()}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{launch.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(launch.date_utc).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      // Toggle: if already selected alone, deselect all. Otherwise, select only this one.
                      if (selectedLaunches.size === 1 && selectedLaunches.has(launch.id)) {
                        setSelectedLaunches(new Set());
                      } else {
                        setSelectedLaunches(new Set([launch.id]));
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '6px',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                    }}
                    title={t.play}
                  >
                    <Rocket
                      size={16}
                      style={{ color: selectedLaunches.has(launch.id) ? '#fbbf24' : '#60a5fa' }}
                    />
                  </button>

                  <button
                    onClick={() => openModal(launch)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '6px',
                      color: '#a78bfa',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(168, 85, 247, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                    }}
                    title={t.info}
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {isModalOpen && modalLaunch && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }} onClick={() => setIsModalOpen(false)}>
            <div className="glass-panel" style={{
              width: '95%',
              maxWidth: '1400px',
              maxHeight: '95vh',
              overflowY: 'auto',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }} onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: '800' }}>{modalLaunch.name}</h2>
                  <div style={{
                    background: modalLaunch.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: modalLaunch.success ? '#4ade80' : '#f87171',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: `1px solid ${modalLaunch.success ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
                  }}>
                    {modalLaunch.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {modalLaunch.success ? t.successful : t.failed}
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body - 2 Columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 900 ? '350px 1fr' : '1fr',
                gap: '2rem'
              }}>

                {/* Left Column: Mission Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(() => {
                    // 미션별 패치 정보 가져오기
                    const patchInfo = getMissionPatchUrl(modalLaunch.name);
                    const isStarlink = patchInfo.isStarlink;
                    const starlinkColors = patchInfo.colors;
                    
                    // API 패치 우선, 없으면 elonx.net 패치 시도
                    // API 패치가 실제 패치 이미지인지 확인 (로켓 이미지가 아닌 경우만)
                    const apiPatch = modalLaunch.links?.patch?.small;
                    const elonxPatch = patchInfo.url;
                    // API 패치가 로켓 이미지가 아닌 실제 패치인지 확인
                    // 패치 이미지는 보통 "patch"라는 단어를 포함하거나, 특정 패턴을 가짐
                    const isValidPatch = apiPatch && (
                      apiPatch.toLowerCase().includes('patch') || 
                      apiPatch.toLowerCase().includes('mission_patch') ||
                      apiPatch.toLowerCase().includes('mission-patch')
                    ) && !apiPatch.includes('falcon') && !apiPatch.includes('rocket') && !apiPatch.includes('slc_image');
                    const displayPatch = (isValidPatch ? apiPatch : null) || elonxPatch;
                    const zoomImage = modalLaunch.links?.patch?.large || (isValidPatch ? apiPatch : null) || elonxPatch;

                    return (
                      <div
                        onClick={() => displayPatch && zoomImage && setZoomedImage(zoomImage)}
                        style={{
                          position: 'relative',
                          background: isStarlink && !displayPatch
                            ? `linear-gradient(135deg, ${starlinkColors?.primary}15, ${starlinkColors?.secondary}25)`
                            : 'rgba(255,255,255,0.03)',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          textAlign: 'center',
                          border: isStarlink && !displayPatch
                            ? `1px solid ${starlinkColors?.primary}40`
                            : '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.2s',
                          cursor: displayPatch ? 'zoom-in' : 'default',
                          minHeight: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isStarlink && !displayPatch
                            ? `linear-gradient(135deg, ${starlinkColors?.primary}25, ${starlinkColors?.secondary}35)`
                            : 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = isStarlink && !displayPatch
                            ? starlinkColors?.primary
                            : 'rgba(96, 165, 250, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isStarlink && !displayPatch
                            ? `linear-gradient(135deg, ${starlinkColors?.primary}15, ${starlinkColors?.secondary}25)`
                            : 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = isStarlink && !displayPatch
                            ? `${starlinkColors?.primary}40`
                            : 'rgba(255,255,255,0.05)';
                        }}
                        title={displayPatch ? (language === 'ko' ? '클릭하여 확대' : 'Click to zoom') : ''}
                      >
                        {displayPatch ? (
                          <img
                            src={displayPatch}
                            alt="Mission Patch"
                            style={{ 
                              maxHeight: '130px',
                              maxWidth: '100%',
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              // 이미지 로드 실패시 elonx.net 패치면 숨김, API 패치면 대체 처리
                              if (displayPatch === elonxPatch) {
                                // elonx.net 이미지 로드 실패시 API 패치로 대체 시도
                                if (apiPatch) {
                                  e.target.src = apiPatch;
                                } else {
                                  e.target.style.display = 'none';
                                }
                              } else {
                                // API 이미지 로드 실패시 elonx.net 패치로 대체 시도
                                if (elonxPatch && displayPatch !== elonxPatch) {
                                  e.target.src = elonxPatch;
                                } else {
                                  e.target.style.display = 'none';
                                }
                              }
                            }}
                          />
                        ) : isStarlink ? (
                          // Starlink 그룹 미션용 동적 배지
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${starlinkColors?.primary || '#3b82f6'}, ${starlinkColors?.secondary || '#1d4ed8'})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 0 20px ${starlinkColors?.primary || '#3b82f6'}50`
                            }}>
                              <Rocket size={36} color="#fff" />
                            </div>
                            <div style={{
                              fontSize: '0.7rem',
                              color: starlinkColors?.primary || '#60a5fa',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {patchInfo.groupName || 'Starlink Mission'}
                            </div>
                          </div>
                        ) : (
                          // 패치 없음 표시
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: '#94a3b8',
                            fontSize: '0.85rem'
                          }}>
                            <ImageIcon size={48} color="#475569" opacity={0.5} />
                            <div>{language === 'ko' ? '패치 없음' : 'No patch available'}</div>
                          </div>
                        )}
                        {displayPatch && (
                          <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            padding: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                            pointerEvents: 'none'
                          }}>
                            <ZoomIn size={16} color="#fff" />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' }}>{t.rocket.toUpperCase()}</label>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '0.25rem' }}>{modalLaunch.rocket?.name}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' }}>{t.date.toUpperCase()}</label>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '0.25rem' }}>{new Date(modalLaunch.date_utc).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' }}>{t.launchpad.toUpperCase()}</label>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', marginTop: '0.25rem' }}>{modalLaunch.launchpad?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{modalLaunch.launchpad?.region}</div>
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' }}>{t.payloads.toUpperCase()}</label>
                    {modalLaunch.payloads?.map(p => (
                      <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.4rem', borderLeft: '3px solid #3b82f6' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{p.type} • {p.orbit}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {/* 공식 홈페이지 */}
                    {(() => {
                      const officialWebsite = getMissionOfficialWebsite(modalLaunch.name) || modalLaunch.links?.webcast || modalLaunch.links?.article;
                      if (!officialWebsite) return null;
                      
                      return (
                        <a
                          href={officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="search-btn-premium"
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                          <ExternalLink size={16} color="#60a5fa" /> <span>{language === 'ko' ? '공식 홈페이지' : 'Official Website'}</span>
                        </a>
                      );
                    })()}

                    {/* 구글 */}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(modalLaunch.name + ' SpaceX')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-btn-premium"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                      <Search size={16} color="#60a5fa" /> <span>{language === 'ko' ? '구글' : 'Google'}</span>
                    </a>

                    {/* 이미지 */}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(modalLaunch.name + ' SpaceX')}&tbm=isch`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-btn-premium"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                      <ImageIcon size={16} color="#a78bfa" /> <span>{language === 'ko' ? '이미지' : 'Images'}</span>
                    </a>

                    {/* 유튜브 */}
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(modalLaunch.name + ' SpaceX launch')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-btn-premium"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                      <Youtube size={16} color="#f87171" /> <span>{language === 'ko' ? '유튜브' : 'YouTube'}</span>
                    </a>
                  </div>
                </div>

                {/* Right Column: Media (Video, Trajectory, Map) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Official Video Section */}
                  {(() => {
                    const videoId = getMissionVideoId(modalLaunch.name) || modalLaunch.links?.youtube_ids?.[0];
                    if (!videoId) return null;
                    
                    return (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <Youtube size={12} /> {language === 'ko' ? '공식 영상' : 'OFFICIAL VIDEO'}
                        </label>
                        <div style={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#0a0a0a',
                          border: '1px solid rgba(255,255,255,0.1)',
                          width: '100%',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        >
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0`}
                            title={language === 'ko' ? '공식 영상' : 'Official Video'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Map Section */}
                  {modalLaunch.launchpad?.latitude && (
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <MapPin size={12} /> LOCATION
                      </label>
                      <a
                        href={`https://www.google.com/maps/@${modalLaunch.launchpad.latitude},${modalLaunch.launchpad.longitude},15z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'block', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <iframe
                          width="100%" height="200" frameBorder="0" style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                          src={`https://www.google.com/maps?q=${modalLaunch.launchpad.latitude},${modalLaunch.launchpad.longitude}&hl=ko&z=17&output=embed&t=k`}
                          allowFullScreen
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Splash Modal */}
        {isSplashOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              overflow: 'auto'
            }}
            onClick={() => setIsSplashOpen(false)}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '693px',
                width: '100%',
                background: 'rgba(5, 5, 16, 0.95)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsSplashOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={20} color="#fff" />
              </button>

              {/* Splash Image */}
              <div style={{ position: 'relative', width: '100%', height: '550px', overflow: 'hidden' }}>
                <img
                  src="/SPACEX/splash.jpg"
                  alt="SpaceX Mission Control"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Info Section */}
              <div style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {/* App Name */}
                <div>
                  <h2 style={{
                    fontSize: '2.5rem',
                    margin: 0,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}>
                    SpaceX Explorer
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
                    {language === 'ko' ? '실시간 궤도 추적 및 착륙 지역 시각화' : 'Real-time Trajectory Tracking & Landing Zone Visualization'}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 style={{
                    color: '#60a5fa',
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}>
                    {language === 'ko' ? '기술 스택' : 'Tech Stack'}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    {[
                      { name: 'React 19', desc: language === 'ko' ? 'UI 컴포넌트' : 'UI Components', url: 'https://react.dev/' },
                      { name: 'Vite', desc: language === 'ko' ? '빌드 도구' : 'Build Tool', url: 'https://vitejs.dev/' },
                      { name: 'Three.js', desc: language === 'ko' ? '3D 렌더링' : '3D Rendering', url: 'https://threejs.org/' },
                      { name: 'react-globe.gl', desc: language === 'ko' ? '지구본 시각화' : 'Globe Visualization', url: 'https://github.com/vasturiano/react-globe.gl' },
                      { name: 'D3.js', desc: language === 'ko' ? '궤적 계산' : 'Trajectory Calculation', url: 'https://d3js.org/' },
                      { name: 'Axios', desc: language === 'ko' ? 'API 통신' : 'API Communication', url: 'https://axios-http.com/' }
                    ].map((tech, idx) => (
                      <a
                        key={idx}
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.2s',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          display: 'block'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ color: '#60a5fa', fontWeight: '600', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {tech.name}
                          <ExternalLink size={12} color="#60a5fa" />
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          {tech.desc}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Developer Info */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1.5rem'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ color: '#cbd5e1', lineHeight: '1.8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{language === 'ko' ? '프로젝트' : 'Project'}:</strong> SpaceX Launch Visualizer
                      </div>
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{language === 'ko' ? '버전' : 'Version'}:</strong> 1.0.0
                      </div>
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{language === 'ko' ? '데이터 소스' : 'Data Source'}:</strong> SpaceX API v4
                      </div>
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{language === 'ko' ? '개발자' : 'Developer'}:</strong> <a href="mailto:jvisualschool@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>Jinho Jung</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zoomed Image Modal */}
        {zoomedImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 300,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              cursor: 'zoom-out'
            }}
            onClick={() => setZoomedImage(null)}
          >
            <button
              onClick={() => setZoomedImage(null)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 301
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={24} />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Mission Patch"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
