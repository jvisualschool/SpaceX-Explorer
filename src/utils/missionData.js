// CSV 파일에서 추출한 미션 데이터 매핑
// missions_info_final.csv에서 추출한 정보

// 미션 이름을 정리하는 함수
function cleanMissionName(missionName) {
  return missionName
    .replace(/Falcon 9 Block 5 \| /gi, '')
    .replace(/Falcon 9 \| /gi, '')
    .replace(/Falcon Heavy \| /gi, '')
    .replace(/Starship \| /gi, '')
    .trim();
}

// CSV 데이터를 기반으로 한 미션 정보 매핑
const MISSION_DATA = {
  'CSG-3': {
    videoUrl: 'https://www.youtube.com/watch?v=v42tZKmJE_Q',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_LANDING_ZONE_DESKTOP_ab4e183b01.webp',
    officialWebsite: 'https://www.spacex.com/launches/cosmo-skymedfm3'
  },
  'Starlink Group 15-13': {
    videoUrl: 'https://www.youtube.com/watch?v=8rJx6YbcFx0',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp',
    officialWebsite: 'https://www.spacex.com/launches/sl-15-13'
  },
  'Starlink Group 15-12': {
    videoUrl: 'https://www.youtube.com/watch?v=HHDmFKHWT2E',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-15-12'},
  'Starlink Group 15-11': {
    videoUrl: 'https://www.youtube.com/watch?v=5GDcEXT6mCQ',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-15-11'},
  'NROL-77': {
    videoUrl: 'https://www.youtube.com/watch?v=CMJz_kRcQZE',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_LANDING_ZONE_DESKTOP_34a3d0ee3c.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/nrol77'},
  'Starlink Group 15-10': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-15-10'},
  'Transporter 15': {
    videoUrl: 'https://www.youtube.com/watch?v=5xdMcNIgPoA',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/transporter-15'},
  'Transporter 15 (Dedicated SSO Rideshare)': {
    videoUrl: 'https://www.youtube.com/watch?v=5xdMcNIgPoA',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  },
  'Sentinel-6B': {
    videoUrl: 'https://www.youtube.com/watch?v=6tyr0ld2ZB4',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_LANDING_ZONE_DESKTOP_ab4e183b01.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sentinel-6b'},
  'Starlink Group 6-99': {
    videoUrl: 'https://www.youtube.com/watch?v=JD05O8b1kKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-99'},
  'Bandwagon 4': {
    videoUrl: 'https://www.youtube.com/watch?v=5-gB0HPhOME',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_LANDING_ZONE_DESKTOP_34a3d0ee3c.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/bandwagon-4'},
  'Bandwagon 4 (Dedicated Mid-Inclination Rideshare)': {
    videoUrl: 'https://www.youtube.com/watch?v=5-gB0HPhOME',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_LANDING_ZONE_DESKTOP_34a3d0ee3c.webp'
  },
  'Starlink Group 6-82': {
    videoUrl: 'https://www.youtube.com/watch?v=F7gptlD-k5Q',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-82'},
  'Starlink Group 6-90': {
    videoUrl: 'https://www.youtube.com/watch?v=I5O55zpr8AY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-90'},
  'Starlink Group 6-92': {
    videoUrl: 'https://www.youtube.com/watch?v=HN03q45_ffo',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-92'},
  'SpainSat NG II': {
    videoUrl: 'https://www.youtube.com/watch?v=McPj0d75oew',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/spainsat-ng-ii'},
  'Starlink Group 6-95': {
    videoUrl: 'https://www.youtube.com/watch?v=SxQbmnhLxIQ',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-95'},
  'SDA Tranche 1 Transport Layer C': {
    videoUrl: 'https://www.youtube.com/watch?v=_7GJG4i5y5U',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sda-t1tl-c'},
  'Starlink Group 6-86': {
    videoUrl: 'https://www.youtube.com/watch?v=XmHDlhL4yro',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-86'},
  'Starlink Group 6-79': {
    videoUrl: 'https://www.youtube.com/watch?v=zlSB4POamOU',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-79'},
  'Amazon Leo (KF-03)': {
    videoUrl: 'https://www.youtube.com/watch?v=ltOy7WTPQHo',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/kf-03'},
  'Flight 11': {
    videoUrl: 'https://www.youtube.com/watch?v=7bcpnn_PO-A',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/starship-flight-11',
    officialWebsite: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'},
  'Starship | Flight 11': {
    videoUrl: 'https://www.youtube.com/watch?v=7bcpnn_PO-A',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  },
  'Starlink Group 6-78': {
    videoUrl: 'https://www.youtube.com/watch?v=bydgRejCR7c',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-78'},
  'IMAP & others': {
    videoUrl: 'https://www.youtube.com/watch?v=uHBejoN6LQY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  },
  'IMAP': {
    videoUrl: 'https://www.youtube.com/watch?v=uHBejoN6LQY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/imap'},
  'Starlink Group 6-94': {
    videoUrl: 'https://www.youtube.com/watch?v=HrYMzZoL5RA',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-94'},
  'NROL-48': {
    videoUrl: 'https://www.youtube.com/watch?v=8ssKJfHvjgg',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_LANDING_ZONE_DESKTOP_ab4e183b01.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/nrol-48'},
  'Starlink Group 6-85': {
    videoUrl: 'https://www.youtube.com/watch?v=-scO62MLNL0',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-85'},
  'Starlink Group 6-89': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-89'},
  'Starlink Group 6-87': {
    videoUrl: 'https://www.youtube.com/watch?v=J3GGY0N_Hak',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-87'},
  'Starlink Group 11-15': {
    videoUrl: 'https://www.youtube.com/watch?v=PobJVuhJA-g',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-15'},
  'Starlink Group 11-25': {
    videoUrl: 'https://www.youtube.com/watch?v=N_9T7LFxIiA',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-25'},
  'Starlink Group 11-30': {
    videoUrl: 'https://www.youtube.com/watch?v=K7TtY--vGOk',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-30'},
  'Starlink Group 6-81': {
    videoUrl: 'https://www.youtube.com/watch?v=XmHDlhL4yro',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-6-81'},
  'Starlink Group 11-14': {
    videoUrl: 'https://www.youtube.com/watch?v=AHEdu6wVNJc',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-14'},
  'Starlink Group 11-23': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-23'},
  'Starlink Group 11-21': {
    videoUrl: 'https://www.youtube.com/watch?v=X7gTcwaNgYc',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-21'},
  'Starlink Group 11-12': {
    videoUrl: 'https://www.youtube.com/watch?v=0rxFbWs_POU',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-12'},
  'Starlink Group 11-5': {
    videoUrl: 'https://www.youtube.com/watch?v=qA1KTPs-KOY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-5'},
  'Starlink Group 11-19': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-19'},
  'Starlink Group 11-20': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-20'},
  'Starlink Group 11-39': {
    videoUrl: 'https://www.youtube.com/watch?v=uJ5J0PYGPKs',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-39'},
  'Starlink Group 11-17': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-11-17'},
  'Starlink Group 10-51': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-51'},
  'Starlink Group 10-37': {
    videoUrl: 'https://www.youtube.com/watch?v=JGBbBRXOcE4',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-37'},
  'Starlink Group 10-21': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-21'},
  'Starlink Group 10-17': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-17'},
  'Starlink Group 10-52': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-52'},
  'Starlink Group 10-15': {
    videoUrl: 'https://www.youtube.com/watch?v=8PNwT_unq54',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-15'},
  'Starlink Group 10-27': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-27'},
  'Starlink Group 10-59': {
    videoUrl: 'https://www.youtube.com/watch?v=ub0DqULiKdY',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_DRONESHIP_DESKTOP_99b12d8c08.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-10-59'},
  'Starlink Group 17-11': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-17-11'},
  'Starlink Group 17-12': {
    videoUrl: 'https://www.youtube.com/watch?v=bjMWs_W_WKM',
    trajectoryImage: 'https://sxcontent9668.azureedge.us/cms-assets/assets/F9_CALIFORNIA_DRONESHIP_DESKTOP_f7b8e9c3d4.webp'
  ,
    officialWebsite: 'https://www.spacex.com/launches/sl-17-12'}
};

// YouTube URL에서 비디오 ID 추출
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

// 미션 이름으로 데이터 가져오기
export const getMissionData = (missionName) => {
  if (!missionName) return { videoUrl: null, trajectoryImage: null, officialWebsite: null };
  
  const cleanName = cleanMissionName(missionName);
  
  // 정확한 매칭 시도
  if (MISSION_DATA[cleanName]) {
    return MISSION_DATA[cleanName];
  }
  
  // 부분 매칭 시도 (대소문자 무시)
  const cleanNameLower = cleanName.toLowerCase();
  for (const [key, value] of Object.entries(MISSION_DATA)) {
    const keyLower = key.toLowerCase();
    // 정확히 일치하거나, 한쪽이 다른 쪽을 포함하는 경우
    if (cleanNameLower === keyLower || 
        cleanNameLower.includes(keyLower) || 
        keyLower.includes(cleanNameLower)) {
      return value;
    }
  }
  
  // 추가 매칭: Starlink 그룹 번호 추출
  const starlinkMatch = cleanName.match(/starlink\s+group\s+(\d+)[- ](\d+)/i);
  if (starlinkMatch) {
    const group = `${starlinkMatch[1]}-${starlinkMatch[2]}`;
    const starlinkKey = `Starlink Group ${group}`;
    if (MISSION_DATA[starlinkKey]) {
      return MISSION_DATA[starlinkKey];
    }
  }
  
  // NROL 미션 매칭
  const nrolMatch = cleanName.match(/nrol[- ]?(\d+)/i);
  if (nrolMatch) {
    const nrolKey = `NROL-${nrolMatch[1]}`;
    if (MISSION_DATA[nrolKey]) {
      return MISSION_DATA[nrolKey];
    }
  }
  
  return { videoUrl: null, trajectoryImage: null, officialWebsite: null };
};

// YouTube 비디오 ID 가져오기
export const getMissionVideoId = (missionName) => {
  const data = getMissionData(missionName);
  return data.videoUrl ? getYouTubeId(data.videoUrl) : null;
};

// 로켓 이동 경로 이미지 URL 가져오기
export const getMissionTrajectoryImage = (missionName) => {
  const data = getMissionData(missionName);
  return data.trajectoryImage || null;
};

// 공식 웹페이지 URL 가져오기
export const getMissionOfficialWebsite = (missionName) => {
  const data = getMissionData(missionName);
  return data.officialWebsite || null;
};

